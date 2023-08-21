<template>
    <Head>
            <Title>
                {{ title ?? _title }}
            </Title>
            <Meta name="description" :content="`${desc}\n${_description}`"/>
            <Meta name="keywords" :content="`${_keywords},${keywords}`"/>
            <Meta property="og:type" content="website"/>
            <Meta property="og:url" :content="url"/>
            <Meta property="og:title" :content="title ?? _title"/>
            <Meta property="og:description" :content="`${desc}\n${_description}`"/>
            <Meta property="og:image" :content="src"/>

            <Meta property="twitter:card" content="summary_large_image"/>
            <Meta property="twitter:url" :content="url"/>
            <Meta property="twitter:title" :content="title ?? _title"/>
            <Meta property="twitter:description" :content="`${desc}\n${_description}`"/>
            <Meta property="twitter:image" :content="src"/>

            <Meta name="author" content="Tonni DIaz"/>
            <Meta name="publisher" content="Tonni DIaz"/>
            <Meta name="copyright" content="Tunedbass"/>

        
    </Head>
  </template>
  <script setup lang="ts">
  import { root } from "@/utils/constants";

  const _title = "Watch all your favorite Movies And TV Shows in HD - TunedStreamz";
  const _description = "TunedStreamz is a free movie and tv show streaming site with daily update on new content.";
  const _keywords = 'tunedstreamz, tunedstreams, tuneds treamz, tuneds treams, apps by Tonni Diaz, Tonni Diaz, tunedbass site, tunedstreamz, TunedStreamz, Tuned, goojara, goojara alternatives, afdah, afdah alternatives, tuned, streamz, stream, streams, tunedstreams, free movie streaming site, free movies site, watch movies online free, watch tv series online free,123movies, 123movies alternatives,'
  
  defineProps({
    title: { type: String },
    src: { type: String, default: root + "/assets/images/meta/home.png", },
    desc: { type: String, default: "" },
    url: { type: String, default: root },
    keywords: { type: String, default: "" },
  })

useHead({
    script: [

        // Google Analyticts 
        {
            async: true,
            src: "https://www.googletagmanager.com/gtag/js?id=G-NMN9VWLJ6B"
        },
        {
            innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NMN9VWLJ6B');
            `
        }
    ]
})
  </script>
  