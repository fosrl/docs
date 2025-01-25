import CodeBlock from "@theme/CodeBlock";
import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const UpdatingVersionsYaml: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const pangolinVersion = await fetchLatestRelease("fosrl/pangolin");

            setText(`services:
  pangolin:
    image: fosrl/pangolin:${pangolinVersion} # increase the tag to the latest version number, or use "latest"
    container_name: pangolin
    restart: unless-stopped
    ...`);
        })();
    }, []);

    return <CodeBlock language="yml">{text}</CodeBlock>;
};

export default UpdatingVersionsYaml;
