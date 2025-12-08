#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EdgeStack } from "../lib/edge-stack";
import { TanStackLambdaDemoStack } from "../lib/tan-stack-lambda-demo-stack";

const app = new cdk.App();

const edgeStack = new EdgeStack(app, "EdgeStack", {
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  crossRegionReferences: true,
});

new TanStackLambdaDemoStack(app, "TanStackLambdaDemoStack", {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  crossRegionReferences: true,
  edgeFunction: edgeStack.edgeFunction,
});
