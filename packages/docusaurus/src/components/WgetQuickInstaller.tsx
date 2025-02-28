import CodeBlock from "@theme/CodeBlock";
import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const WgetQuickInstall: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const release = await fetchLatestRelease("fosrl/pangolin");
            setText(
                `wget -O installer "https://github.com/fosrl/pangolin/releases/download/${release}/installer_linux_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')" && chmod +x ./installer`
            );
        })();
    }, []);

    return <CodeBlock language="bash">{text}</CodeBlock>;
};

export default WgetQuickInstall;
