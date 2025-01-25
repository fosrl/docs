export async function fetchLatestRelease(repo: string) {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${repo}/releases/latest`
        );
        if (!response.ok) {
            throw new Error(
                `Failed to fetch release info: ${response.statusText}`
            );
        }
        const data = await response.json();
        const latestVersion = data.tag_name;
        return latestVersion;
    } catch (error) {
        console.error("Error fetching latest release:", error);
    }
}
