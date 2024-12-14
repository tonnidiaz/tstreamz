<script lang="ts">
    const { num = 1 }: { num?: 1 | 2 | 3 | 4 | 5 } = $props();
</script>

<div>
    <p>Banner ad</p>
    {#if num == 1}
        <div>
            <script type="text/javascript">
                atOptions = {
                    key: "d243e9da777dcf76bf5160990d8fd611",
                    format: "iframe",
                    height: 60,
                    width: 468,
                    params: {},
                };
            </script>
            <script
                type="text/javascript"
                src="//www.highperformanceformat.com/d243e9da777dcf76bf5160990d8fd611/invoke.js"
            ></script>
        </div>
    {:else if num == 2}
        <div>
            <script type="text/javascript">
                atOptions = {
                    key: "b436ba41495d61d2a534877dcf807e41",
                    format: "iframe",
                    height: 300,
                    width: 160,
                    params: {},
                };
            </script>
            <script
                type="text/javascript"
                src="//www.highperformanceformat.com/b436ba41495d61d2a534877dcf807e41/invoke.js"
            ></script>
        </div>

        {:else if num == 3}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : '3250930c70aa7fcdd181731d6008d01a',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/3250930c70aa7fcdd181731d6008d01a/invoke.js"></script>
        </div>
        {:else if num == 4}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : 'cefc115188f6ef4b75c4e0671f6fadbe',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/cefc115188f6ef4b75c4e0671f6fadbe/invoke.js"></script>
        </div>
        {:else if num == 5}
        <div>
            <script type="text/javascript">
                atOptions = {
                    'key' : '80ddc7f0e281dd15451c26ca227eecab',
                    'format' : 'iframe',
                    'height' : 600,
                    'width' : 160,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/80ddc7f0e281dd15451c26ca227eecab/invoke.js"></script>
        </div>
    {/if}
</div>
