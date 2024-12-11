<script lang="ts">
    import { dev } from "$app/environment";
    let { num = 1 }: { num?: 1 | 2  } = $props();
</script>

<div style="margin: auto">
    {#if dev}
        <span>TerraBanner</span>
    {/if}

    {#if num == 1}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : 'e95a1554c0e4fb8af0670a143a2d1ee9',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//digestsolicitorpolar.com/e95a1554c0e4fb8af0670a143a2d1ee9/invoke.js"></script>
        </div>

        {:else if num == 2}
                <div>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'c449e4058fb38601819eadd0f3f832f3',
                            'format' : 'iframe',
                            'height' : 250,
                            'width' : 300,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//digestsolicitorpolar.com/c449e4058fb38601819eadd0f3f832f3/invoke.js"></script>
                </div>
        {:else if num == 3}
                <div>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : 'd389ac66b077c888679d2570b01458e1',
                            'format' : 'iframe',
                            'height' : 60,
                            'width' : 468,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="//digestsolicitorpolar.com/d389ac66b077c888679d2570b01458e1/invoke.js"></script>
                </div>
    {/if}
</div>
