import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";

import { RestApi } from "@aws-cdk/aws-apigateway";
import { apiWithTable, ApiWithTableProps } from "../utils/api-commons";
import { LayerVersion } from "@aws-cdk/aws-lambda";
import ServiceProps from "../utils/service-props";
import createQRTable from "./tables/create-qr-table";

const createQRApi = (
  scope: cdk.Construct,
  api: RestApi,
  layer: LayerVersion,
  serviceProps: ServiceProps
) => {
  const apiEndpoint = api.domainName?.domainName;
  const endpoint: string = `https://${apiEndpoint}/qr`;
  const table: ddb.Table = createQRTable(scope, serviceProps);

  // QR Image Bucket
  const bucketName: string = `images.qr.${serviceProps.serviceRootDomain}`;
  const imageBucket = new s3.Bucket(scope, "QrImagesBucket", {
    bucketName: bucketName,
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const environmentVars = {
    TABLE_NAME: table.tableName,
    ENDPOINT: endpoint,
    IMAGE_BUCKET_NAME: imageBucket.bucketName,
  };

  const qrApiProps: ApiWithTableProps = {
    name: "qr",
    method: ["POST", "GET"],
    api: api,
    table: table,
    codePath: "compute/api",
    handler: "entrypoint.handler",
    environment: environmentVars,
    layer: layer,
  };

  const lambdaFunction = apiWithTable(scope, qrApiProps);
  imageBucket.grantReadWrite(lambdaFunction);
};

export default createQRApi;
