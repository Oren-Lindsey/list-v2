<script context="module">
    export const load = async ({ url }) => ({ props: { url } });
</script>
<script>
    import "../app.css";
    import PageTransition from "$lib/components/PageTransition.svelte";
    export let url
</script>

<nav class="w-full top-0 grid place-items-center mt-0 bg-theme border-b-2 border-x-0 border-t-0 border-b-darkgrey dark:border-b-white">
    <div class="grid grid-cols-2 w-md">
        <a href="/">
            <h1 class="text-xl m-2 text-black dark:text-white">Home</h1>
        </a>
        <a href="/list">
            <h1 class="text-xl m-2 text-black dark:text-white">List</h1>
        </a>
    </div>
</nav>
<PageTransition {url}>
    <div class="grid place-items-center m-4 place-content-center">
        <slot />
    </div>
</PageTransition>