import CodeBlock from "@theme/CodeBlock";
import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const WithoutTunnelingCompose: React.FC = () => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    (async () => {
      const pangolinVersion = await fetchLatestRelease("fosrl/pangolin");

      setText(`services:
  pangolin:
    image: fosrl/pangolin:${pangolinVersion}
    container_name: pangolin
    restart: unless-stopped
    volumes:
      - ./config:/app/config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/"]
      interval: "3s"
      timeout: "3s"
      retries: 15

  traefik:
    image: traefik:v3.3.3
    container_name: traefik
    restart: unless-stopped
    ports: # added ports to expose from traefik
      - 443:443
      - 80:80
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --configFile=/etc/traefik/traefik_config.yml
    volumes:
      - ./config/traefik:/etc/traefik:ro # Volume to store the Traefik configuration
      - ./config/letsencrypt:/letsencrypt # Volume to store the Let's Encrypt certificates
`);
    })();
  }, []);

  return <CodeBlock language="yml">{text}</CodeBlock>;
};

export default WithoutTunnelingCompose;
