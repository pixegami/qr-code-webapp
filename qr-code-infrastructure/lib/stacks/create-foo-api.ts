import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
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

  const fooEnvironment = {
    TABLE_NAME: table.tableName,
    ENDPOINT: endpoint
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

  apiWithTable(scope, fooApiProps);
};

export default createFooApi;
