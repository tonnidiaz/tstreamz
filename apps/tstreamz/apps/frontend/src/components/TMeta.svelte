<script lang="ts">
    import { page } from "$app/stores";
    import { SITE, SITE_SLOGAN, DEVELOPER, siteDesc } from "@/lib/constants";
    const ROOT = $page.url.origin

    const _title = `${SITE} - ${SITE_SLOGAN}`;

    let {
        title = _title,
        src = ROOT + "/assets/images/logo.png",
        desc = ``,
        keywords = SITE.toLowerCase(),
        url: _url
    }: {
        title?: string;
        src?: string;
        desc?: string;
        url?: string;
        keywords?: string;
    } = $props();
    let __title = $derived((title || _title).trim())

    const _description = $derived(((desc || '') + '\n' + siteDesc).trim());
    const url = $derived($page.url.href)

    // useHead({
    //     script: [

    //         // Google Analyticts
    //         {
    //             async: true,
    //             src: "https://www.googletagmanager.com/gtag/js?id=G-NMN9VWLJ6B"
    //         },
    //         {
    //             innerHTML: `
    //             window.dataLayer = window.dataLayer || [];
    //             function gtag(){dataLayer.push(arguments);}
    //             gtag('js', new Date());

    //             gtag('config', 'G-NMN9VWLJ6B');
    //             `
    //         }
    //     ]
    // })
</script>

<svelte:head>
    <title>
       {__title}
    </title>
    <meta name="description" content={`${_description}`} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={__title} />
    <meta property="og:description" content={`${_description}`} />
    <meta property="og:image" content={src} />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content={__title} />
    <meta property="twitter:description" content={`${_description}`} />
    <meta property="twitter:image" content={src} />

    <meta name="author" content={DEVELOPER} />
    <meta name="publisher" content={DEVELOPER} />
    <meta name="copyright" content={SITE} />
</svelte:head>
