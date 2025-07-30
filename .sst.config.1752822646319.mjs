import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/DocusaurusStack.ts
import { StaticSite } from "sst/constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import { ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
function DocusaurusStack({ stack }) {
  const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
    domainName: "fossorial.io"
  });
  const site = new StaticSite(stack, "DocusaurusSite", {
    path: "packages/docusaurus",
    buildOutput: "build",
    buildCommand: "npm run build",
    customDomain: {
      domainName: "docs.fossorial.io",
      hostedZone: hostedZone.zoneName,
      isExternalDomain: false
    },
    cdk: {
      distribution: {
        defaultBehavior: {
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          compress: true
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html"
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html"
          }
        ]
      }
    }
  });
  stack.addOutputs({});
}
__name(DocusaurusStack, "DocusaurusStack");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "docs",
      region: "us-east-1"
    };
  },
  stacks(app) {
    app.stack(DocusaurusStack);
  }
};
export {
  sst_config_default as default
};
