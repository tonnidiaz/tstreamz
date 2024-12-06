<script lang="ts">
    import MenuItem from "./MenuItem.svelte";
</script>

<aside>
    <ul class="menu gap-0 sm:gap-5 sidebar">
        <MenuItem
            title="Home"
            innerClass="justify-center"
            icon="fi fi-rr-house-window"
            to="/"
        />

        <MenuItem
            title="Watchlist"
            innerClass="justify-center"
            icon="fi fi-rr-bookmark"
            to="/me/watchlist"
        ></MenuItem>

        <MenuItem
            title="Search"
            innerClass="justify-center"
            icon="fi fi-rr-search"
        ></MenuItem>
        <MenuItem
            title="Contact us"
            innerClass="justify-center"
            icon="fi fi-rr-envelope"
            to="/contact"
        ></MenuItem>
    </ul>
</aside>
