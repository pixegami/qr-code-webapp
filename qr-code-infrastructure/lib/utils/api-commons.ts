import * as lambda from "@aws-cdk/aws-lambda";
import { RestApi } from "@aws-cdk/aws-apigateway";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { Code, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";
import { Construct, Duration } from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

export interface ApiWithTableProps {
  name: string;
  api: RestApi;
  codePath: string;
  handler: string;
  table: ddb.Table;
  environment: { [key: string]: string };
  layer: LayerVersion;
  method: string[];
}

export const apiWithTable = (scope: Construct, props: ApiWithTableProps) => {
  const functionProps: lambda.FunctionProps = {
    code: Code.fromAsset(props.codePath),
    runtime: Runtime.PYTHON_3_7,
    timeout: Duration.seconds(10),
    handler: props.handler,
    memorySize: 256,
    layers: [props.layer],
    environment: props.environment,
  };

  const sendEmailStatement: iam.PolicyStatement = new iam.PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    effect: iam.Effect.ALLOW,
    resources: ["*"],
  });

  const lambdaFunction = new lambda.Function(scope, props.name, functionProps);
  lambdaFunction.addToRolePolicy(sendEmailStatement);
  props.table.grantFullAccess(lambdaFunction);

  const crudApi = props.api.root.addResource(props.name);
  const crudIntegration = new apigateway.LambdaIntegration(lambdaFunction);

  props.method.forEach((methodName) => {
    crudApi.addMethod(methodName, crudIntegration, {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });
  });
  addCorsOptions(crudApi);
};

export const addCorsOptions = (apiResource: apigateway.IResource) => {
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
};
