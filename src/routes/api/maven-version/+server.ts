import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const groupId = url.searchParams.get("group");
    const artifactId = url.searchParams.get("artifact");

    if (!groupId || !artifactId) {
        return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://repo1.maven.org/maven2/${groupId.replace(/\./g, "/")}/${artifactId}/maven-metadata.xml`);
        const text = await response.text();
        const version = (text.match(/<latest>(.*?)<\/latest>/) || text.match(/<release>(.*?)<\/release>/))?.[1];

        if (!version) {
            return Response.json({ error: "Version not found" }, { status: 404 });
        }

        return Response.json({ version });
    } catch {
        return Response.json({ error: "Failed to fetch version" }, { status: 500 });
    }
};
