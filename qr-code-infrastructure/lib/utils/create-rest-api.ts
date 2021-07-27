import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as route53 from "@aws-cdk/aws-route53";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53targets from "@aws-cdk/aws-route53-targets";
import ServiceProps from "./service-props";

const createRestApi = (
  scope: cdk.Construct,
  apiDomainName: string,
  zone: route53.IHostedZone,
  serviceProps: ServiceProps
) => {
  const apiCert = new acm.DnsValidatedCertificate(scope, "ApiCert", {
    domainName: apiDomainName,
    hostedZone: zone,
  });

  const api = new apigateway.RestApi(scope, "ApiGate", {
    restApiName: `${serviceProps.serviceName} API`,
    domainName: { domainName: apiDomainName, certificate: apiCert },
    deployOptions: {
      methodOptions: {
        "/*/*": {
          // This special path applies to all resource paths and all HTTP methods
          throttlingRateLimit: 2,
          throttlingBurstLimit: 100,
        },
      },
    },
  });

  const recordTarget = route53.RecordTarget.fromAlias(
    new route53targets.ApiGateway(api)
  );

  new route53.ARecord(scope, "ApiRecord", {
    zone: zone,
    target: recordTarget,
    recordName: apiDomainName,
  });

  return api;
};

export default createRestApi;
