import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";

interface TanStackLambdaDemoStackProps extends cdk.StackProps {
  edgeFunction: lambda.Function;
}

export class TanStackLambdaDemoStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: TanStackLambdaDemoStackProps,
  ) {
    super(scope, id, props);

    const handler = new lambda.DockerImageFunction(this, "Handler", {
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, "../../../"),
      ),
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        AWS_LWA_INVOKE_MODE: "response_stream",
      },
    });

    const fnUrl = handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.AWS_IAM,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
    });

    new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.FunctionUrlOrigin.withOriginAccessControl(fnUrl),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            functionVersion: props.edgeFunction.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            includeBody: true,
          },
        ],
      },
    });

    new cdk.CfnOutput(this, "FunctionUrl", {
      value: fnUrl.url,
    });
  }
}
