<template>
    <Head>
            <Title>
                {{ title ?? _title }}
            </Title>
    </Head>
  </template>
  <script setup lang="ts">
  import { root } from "@/utils/constants";

  const _title = "Watch all your favorite Movies And TV Shows in HD - TunedStreamz";
  const _description = "TunedStreamz is a free movie and tv show streaming site with daily update on new content.";
  const _keywords = 'tunedstreamz, tunedstreams, tuneds treamz, tuneds treams, apps by clickbait4587, clickbait4587, tunedbass site, tunedstreamz, TunedStreamz, Tuned, goojara, goojara alternatives, afdah, afdah alternatives, tuned, streamz, stream, streams, tunedstreams, free movie streaming site, free movies site, watch movies online free, watch tv series online free,'
  
  defineProps({
    title: { type: String },
    src: { type: String },
    description: { type: String },
    url: { type: String },
    keywords: { type: String },
  })
  </script>
  