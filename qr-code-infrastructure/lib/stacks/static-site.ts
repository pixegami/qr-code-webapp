#!/usr/bin/env node
import cloudfront = require("@aws-cdk/aws-cloudfront");
import route53 = require("@aws-cdk/aws-route53");
import s3 = require("@aws-cdk/aws-s3");
import acm = require("@aws-cdk/aws-certificatemanager");
import cdk = require("@aws-cdk/core");
import targets = require("@aws-cdk/aws-route53-targets/lib");
import { Construct } from "@aws-cdk/core";

export interface StaticSiteProps {
  rootDomain: string;
  compositeDomain: string;
}

export class StaticSite extends Construct {
  constructor(parent: Construct, name: string, props: StaticSiteProps) {
    super(parent, name);

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.rootDomain,
    });
    const siteDomain = props.compositeDomain;
    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

    // Content bucket
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: siteDomain,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    const certificateArn = new acm.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain,
        hostedZone: zone,
        region: "us-east-1", // Cloudfront only checks this region for certificates.
      }
    ).certificateArn;
    new cdk.CfnOutput(this, "Certificate", { value: certificateArn });

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [siteDomain],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        },
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    });
  }
}
