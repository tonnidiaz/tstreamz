
const staticPages = (url: string) =>
    Object.keys(import.meta.glob("/src/routes/**/+page.(svelte|md)"))
        .filter(
            (page) =>
                !["/src/routes/+page.svelte"].find((filter) =>
                    page.includes(filter)
                )
        ).filter(page=> !page.includes('['))
        .map((page) =>
            page
                .replace("/src/routes", url)
                .replace("/+page.svelte", "")
                .replace("/+page.md", "")
        );

const date = new Date().toISOString();
export const GET = async ({url: _url}): Promise<Response> => {
    const url = _url.pathname;
    const headers: Record<string, string> = {
        "Cache-Control": "max-age=3600",
        "Content-Type": "application/xml",
    };

    return new Response(
        `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    >
      <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        <lastmod>${date}</lastmod>
      </url>
      ${staticPages(url)
          .map(
              (url: string) => `<url>
        <loc>${url}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
        <lastmod>${date}</lastmod>
      </url>`
          )
          .join("")}
    </urlset>`,
        { headers: headers }
    );
};
export const prerender = true;
