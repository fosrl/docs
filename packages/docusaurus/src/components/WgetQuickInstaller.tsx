import React, { useEffect, useState } from "react";
import { fetchLatestRelease } from "../lib/fetchLatestRelease";

const WgetQuickInstall: React.FC = () => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        (async () => {
            const release = await fetchLatestRelease("fosrl/pangolin");
            setText(
                `wget -O installer "https://github.com/fosrl/pangolin/releases/download/${release}/installer_linux_amd64" && chmod +x ./installer`
            );
        })();
    }, []);

    return <>{text}</>;
};

export default WgetQuickInstall;
