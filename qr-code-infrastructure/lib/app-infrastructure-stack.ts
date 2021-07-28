import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as lambda from "@aws-cdk/aws-lambda";
import { StaticSite } from "./stacks/static-site";
import ServiceProps from "./utils/service-props";
import createRestApi from "./utils/create-rest-api";
import createQRApi from "./stacks/create-qr-api";

export class AppInfrastructureStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    serviceProps: ServiceProps,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // Work out the domain names to use.
    const compositeDomain = serviceProps.serviceSubDomain
      ? serviceProps.serviceSubDomain + "." + serviceProps.serviceRootDomain
      : serviceProps.serviceRootDomain;

    const apiDomainName = `api.${compositeDomain}`;

    // The main hosted zone.
    const zone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: serviceProps.serviceRootDomain,
      privateZone: false,
    });

    // Create common Lambda layer.
    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("compute/base_layer/layer.zip"),
      compatibleRuntimes: [
        lambda.Runtime.PYTHON_3_8,
        lambda.Runtime.PYTHON_3_7,
      ],
      license: "Apache-2.0",
      description: "A layer with bcrypt and authentication.",
    });

    const api = createRestApi(this, apiDomainName, zone, serviceProps);
    createQRApi(this, api, layer, serviceProps);

    // Main static site front-end.
    new StaticSite(this, "Site", {
      rootDomain: serviceProps.serviceRootDomain,
      compositeDomain: compositeDomain,
    });
  }
}
