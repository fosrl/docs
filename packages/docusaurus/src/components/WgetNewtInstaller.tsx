import CodeBlock from "@theme/CodeBlock";
import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const WgetNewtInstaller: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const newtVersion = await fetchLatestRelease("fosrl/newt");

            setText(
                `wget -O newt "https://github.com/fosrl/newt/releases/download/${newtVersion}/newt_linux_amd64" && chmod +x ./newt`
            );
        })();
    }, []);

    return <CodeBlock language="bash">{text}</CodeBlock>;
};

export default WgetNewtInstaller;
