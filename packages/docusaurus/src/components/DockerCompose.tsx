import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const DockerCompose: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const pangolinVersion = await fetchLatestRelease("fosrl/pangolin");
            const gerbilVersion = await fetchLatestRelease("fosrl/gerbil");

            setText(
                `services:
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
      retries: 5

  gerbil:
    image: fosrl/gerbil:${gerbilVersion}
    container_name: gerbil
    restart: unless-stopped
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --reachableAt=http://gerbil:3003
      - --generateAndSaveKeyTo=/var/config/key
      - --remoteConfig=http://pangolin:3001/api/v1/gerbil/get-config
      - --reportBandwidthTo=http://pangolin:3001/api/v1/gerbil/receive-bandwidth
    volumes:
      - ./config/:/var/config
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    ports:
      - 51820:51820/udp
      - 443:443 # Port for traefik because of the network_mode
      - 80:80 # Port for traefik because of the network_mode

  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    network_mode: service:gerbil # Ports appear on the gerbil service
    depends_on:
      pangolin:
        condition: service_healthy
    command:
      - --configFile=/etc/traefik/traefik_config.yml
    volumes:
      - ./config/traefik:/etc/traefik:ro # Volume to store the Traefik configuration
      - ./config/letsencrypt:/letsencrypt # Volume to store the Let's Encrypt certificates`
            );
        })();
    }, []);

    return <>{text}</>;
};

export default DockerCompose;
