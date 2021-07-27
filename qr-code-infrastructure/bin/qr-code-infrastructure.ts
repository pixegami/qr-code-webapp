#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppInfrastructureStack } from "../lib/app-infrastructure-stack";
import * as config from "../service.config.json";
import ServiceProps from '../lib/utils/service-props';

// Configure all infrastructure things here.
const serviceProps: ServiceProps = {
  serviceName: config.name,
  serviceRootDomain: config.domain,
  serviceSubDomain: config.subdomain,
  servicePrefix: config.prefix,
  region: config.awsRegion,
};

const app = new cdk.App();
new AppInfrastructureStack(app, `${config.name}`, serviceProps, {
  env: { account: config.awsAccount, region: config.awsRegion },
});