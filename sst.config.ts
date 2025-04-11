import { SSTConfig } from "sst";
import { DocusaurusStack } from "./stacks/DocusaurusStack";

export default {
  config(_input) {
    return {
      name: "docs",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(DocusaurusStack);
  },
} satisfies SSTConfig;
