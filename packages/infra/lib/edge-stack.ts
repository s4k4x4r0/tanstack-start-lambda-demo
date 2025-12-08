import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

export class EdgeStack extends cdk.Stack {
  public readonly edgeFunction: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.edgeFunction = new nodejs.NodejsFunction(this, "EdgeFunction", {
      runtime: lambda.Runtime.NODEJS_24_X,
      entry: path.join(__dirname, "../lambda/edge/index.ts"),
      handler: "handler",
      // Lambda@Edge currently supports only x86_64
      architecture: lambda.Architecture.X86_64,
    });
  }
}
