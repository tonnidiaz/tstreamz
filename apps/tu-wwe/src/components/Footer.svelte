<script>
    import { DISCLAIMER, SITE } from "@/lib";
    import { developer } from "@cmn/utils/consts";
</script>

<footer class="footer footer-center text-base-content p-4 mt-10px">
    <aside>
        <p><b>DISCLAIMER!!</b> {@html DISCLAIMER}</p>
        <a href="mailto:{developer.email}" id="contact" class="text-primary mt-2">
            <span class="top- relative fs-12"
                ><i class="fi fi-br-envelope"></i></span
            >&nbsp;{developer.email}
        </a>
        <p>
            Copyright © {new Date().getFullYear()} - All right reserved by {SITE}
        </p>
    </aside>
</footer>
