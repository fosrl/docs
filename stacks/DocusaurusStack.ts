import { StackContext, StaticSite, use } from "sst/constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import { ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";

export function DocusaurusStack({ stack }: StackContext) {
  const hostedZone = route53.HostedZone.fromLookup(stack, "HostedZone", {
    domainName: "fossorial.io",
  });

  const site = new StaticSite(stack, "DocusaurusSite", {
    path: "packages/docusaurus/website",
    buildOutput: "build",
    buildCommand: "npm run build",
    customDomain: {
      domainName: "docs.fossorial.io",
      hostedZone: hostedZone.zoneName,
      isExternalDomain: false,
    },
    cdk: {
      distribution: {
        defaultBehavior: {
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          compress: true,
        },
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: "/404.html",
          },
        ],
      },
    },
  });

  stack.addOutputs({});
}