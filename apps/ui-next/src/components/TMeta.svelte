<script lang="ts">
    import { page } from "$app/state";
    import { appData } from "../lib/consts";
    const ROOT = page.url.origin

    export interface ITMetaProps {
        title?: string;
        src?: string;
        desc?: string;
        url?: string;
        keywords?: string;
        site?: string;
        slogan?: string;
        siteDesc?: string;
    }
    let {
        title,
        src = ROOT + "/assets/images/logo.png",
        desc = ``,
        url: _url,
        site = "Tu",
        slogan = "Tu app",
        siteDesc = "An app from Tu"
    }: ITMetaProps = $props();
    const _title = `${site} - ${slogan}`;
    let __title = $derived((title || _title).trim())

    const _description = $derived(((desc || '') + '\n' + siteDesc).trim());
    const url = $derived(page.url.href)
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

    <meta name="author" content={appData.author} />
    <meta name="publisher" content={appData.author} />
    <meta name="copyright" content={site} />
</svelte:head>
