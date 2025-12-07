#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TanStackLambdaDemoStack } from "../lib/tan-stack-lambda-demo-stack";

const app = new cdk.App();
new TanStackLambdaDemoStack(app, "TanStackLambdaDemoStack", {});
