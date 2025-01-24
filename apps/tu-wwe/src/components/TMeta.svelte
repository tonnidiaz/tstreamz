<script lang="ts">
    import { SITE, SITE_DESC, SITE_SLOGAN } from '@/lib';
    import TMeta, { type ITMetaProps } from '@repo/ui/components/TMeta.svelte'
    interface IProps extends ITMetaProps{

    }
    let {site = SITE, siteDesc = SITE_DESC, slogan = SITE_SLOGAN, ...props}: IProps = $props()
</script>
<TMeta {site} {siteDesc} {slogan} {...props}/>