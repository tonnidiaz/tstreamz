<a class={`tu-link text-${$page.url.pathname == (to || href) ? 'primary' : ''} ${_class || ''}`} href={to || href} {...props}>{@render children?.()}</a>
<script lang="ts">
    import { page } from '$app/stores';
    import type {HTMLAnchorAttributes} from 'svelte/elements'

    interface IProps extends HTMLAnchorAttributes {to?: string}
    let {children,to, href, class: _class,...props } : IProps = $props()
</script>