import CodeBlock from '@theme/CodeBlock';
import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const StaticTraefikConfig: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const badgerVersion = await fetchLatestRelease("fosrl/badger");

            setText(`api:
  insecure: true
  dashboard: true

providers:
  http:
    endpoint: "http://pangolin:3001/api/v1/traefik-config"
    pollInterval: "5s"
  file:
    filename: "/etc/traefik/dynamic_config.yml"

experimental:
  plugins:
    badger:
      moduleName: "github.com/fosrl/badger"
      version: "${badgerVersion}"

log:
  level: "INFO"
  format: "common"

certificatesResolvers:
  letsencrypt:
    acme:
      httpChallenge:
        entryPoint: web
      email: admin@example.com # REPLACE THIS WITH YOUR EMAIL
      storage: "/letsencrypt/acme.json"
      caServer: "https://acme-v02.api.letsencrypt.org/directory"

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"
    transport:
      respondingTimeouts:
        readTimeout: "30m"
    http:
      tls:
        certResolver: "letsencrypt"

serversTransport:
  insecureSkipVerify: true`);
        })();
    }, []);

    return (
        <CodeBlock language="yml">
            {text}
        </CodeBlock>
    );
};

export default StaticTraefikConfig;
