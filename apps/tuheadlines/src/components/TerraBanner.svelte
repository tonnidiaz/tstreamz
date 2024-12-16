<script lang="ts">
    import { dev } from "$app/environment";

    const { num = 1 }: { num?: 1 | 2 | 3 | 4 | 5 } = $props();
</script>

<div>
    {#if dev}
        <p>Banner ad #{num}</p>
    {/if}

    {#if num == 1}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : 'aa2a2a9a33e197d3a5d383b8ef245e38',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/aa2a2a9a33e197d3a5d383b8ef245e38/invoke.js"></script>
        </div>
    {:else if num == 2}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : '98aa7cc96f09bd999ff0690e6e772b78',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/98aa7cc96f09bd999ff0690e6e772b78/invoke.js"></script>
        </div>
    {:else if num == 3}
        <div></div>
    {:else if num == 4}
        <div></div>
    {:else if num == 5}
        <div></div>
    {/if}
</div>
