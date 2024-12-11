<a data-sveltekit-reload={reload || adfreeRoutes.find(el=> $page.url.pathname.includes(el)) != undefined} class={`tu-link text-${$page.url.pathname == (to || href) ? 'primary' : ''} ${_class || ''}`} href={to || href} {...props}>{@render children?.()}</a>
<script lang="ts">
    import { page } from '$app/stores';
    import type {HTMLAnchorAttributes} from 'svelte/elements'

    interface IProps extends HTMLAnchorAttributes {to?: string; reload?: boolean}
    let {children,to, href, class: _class, reload,...props } : IProps = $props()
    const adfreeRoutes = ['/auth', '/me']
</script>