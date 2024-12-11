<script>

    import { DISCLAIMER, SITE, email } from "@/lib/constants";

</script>
<footer class="footer footer-center text-base-content p-4 mt-10px">
    <aside>
       
        <p><b>DISCLAIMER!!</b> {DISCLAIMER}</p>
            <p id="contact" class="text-primary mt-2"><span class="top- relative fs-12"><i class="fi fi-br-envelope"></i></span>&nbsp;{email}</p>
      <p>Copyright © {new Date().getFullYear()} - All right reserved by {SITE}</p>
    </aside>
  </footer>