<script>
    import { SITE } from "@/lib/constants";


    import TuLink from "@repo/ui-sv/components/TuLink.svelte";

</script>
<div class="flex flex-col h-100p w-100p">
     
    <header>
       <div class="navbar z-[50] flex justify-between">
        <div class=""></div>
        <div class="navbar-center">
            <a href="/" class="btn btn-ghost normal-case text-xl">{SITE}</a>
        </div>
        <div class=""></div>
       </div>
    </header>
  <div class="tu-app relative flex flex-col flex-1" style="padding: 0 10px">
    <slot />
  </div>
  <footer class="footer footer-center text-base-content p-4">
    <aside><p>Copyright © {new Date().getFullYear()} - All right reserved by {SITE}</p></aside>
  </footer>
</div>