import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { BillingMode } from "@aws-cdk/aws-dynamodb";
import ServiceProps from "../../utils/service-props";

const createFooTable = (scope: cdk.Construct, serviceProps: ServiceProps) => {
  const tableName: string = `${serviceProps.servicePrefix}.foo`;
  const table: ddb.Table = new ddb.Table(scope, "ServiceDataTable", {
    partitionKey: {
      name: "pk",
      type: ddb.AttributeType.STRING,
    },
    sortKey: {
      name: "sk",
      type: ddb.AttributeType.STRING,
    },
    timeToLiveAttribute: "expiry_time",
    tableName: tableName,
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  return table;
};

export default createFooTable;
