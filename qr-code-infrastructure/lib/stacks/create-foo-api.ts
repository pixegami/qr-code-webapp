import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";

import { RestApi } from "@aws-cdk/aws-apigateway";
import { apiWithTable, ApiWithTableProps } from "../utils/api-commons";
import { LayerVersion } from "@aws-cdk/aws-lambda";
import ServiceProps from "../utils/service-props";
import createFooTable from "./tables/create_foo_table";

const createFooApi = (
  scope: cdk.Construct,
  api: RestApi,
  layer: LayerVersion,
  serviceProps: ServiceProps
) => {
  const apiEndpoint = api.domainName?.domainName;
  const endpoint: string = `https://${apiEndpoint}/foo`;
  const table: ddb.Table = createFooTable(scope, serviceProps);

  // QR Image Bucket
  const bucketName: string = `images.qr.${serviceProps.serviceRootDomain}`;
  const imageBucket = new s3.Bucket(scope, "QrImagesBucket", {
    bucketName: bucketName,
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const fooEnvironment = {
    TABLE_NAME: table.tableName,
    ENDPOINT: endpoint,
    IMAGE_BUCKET_NAME: imageBucket.bucketName,
  };

  const fooApiProps: ApiWithTableProps = {
    name: "foo",
    method: ["POST", "GET"],
    api: api,
    table: table,
    codePath: "compute/api_foo",
    handler: "foo_entrypoint.handler",
    environment: fooEnvironment,
    layer: layer,
  };

  const lambdaFunction = apiWithTable(scope, fooApiProps);
  imageBucket.grantReadWrite(lambdaFunction);
};

export default createFooApi;
