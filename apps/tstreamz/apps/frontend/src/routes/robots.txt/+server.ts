export const GET = ({ url }) => {
    const host = url.origin;
    return new Response(`# *
User-agent: *
Disallow: /test
Disallow: /test/*
Disallow: /admin/*
Disallow: /site/*
Disallow: /rf/*
Disallow: /me/*

# Host
Host: ${host}

# Sitemaps
Sitemap: ${host}/sitemap.xml
`);
};
export const prerender = true