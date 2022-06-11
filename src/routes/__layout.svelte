<script context="module">
    export const load = async ({ url }) => ({ props: { url } });
</script>
<script>
    import "../app.css";
    import PageTransition from "$lib/components/PageTransition.svelte";
    export let url
</script>
<div class="grid place-items-center">
    <noscript>
        <h1 class="text-4xl text-theme">Please enable javacript</h1>
    </noscript>
</div>
<nav class="w-full top-0 grid place-items-center mt-0 bg-theme border-b-2 border-x-0 border-t-0 border-b-darkgrey dark:border-b-white">
    <div class="grid grid-cols-3 w-md place-items-center">
        <a href="/">
            <h1 class="transition ease-in-out delay-75 text-xl m-2 text-black dark:text-white rounded-md p-1 hover:bg-darkgrey hover:text-white dark:hover:bg-reallydarkgrey">Home</h1>
        </a>
        <a href="/list">
            <h1 class="transition ease-in-out delay-75 text-xl m-2 text-black dark:text-white rounded-md p-1 hover:bg-darkgrey hover:text-white dark:hover:bg-reallydarkgrey">List</h1>
        </a>
        <a href="/login">
            <h1 class="transition ease-in-out delay-75 text-xl m-2 text-black dark:text-white rounded-md p-1 hover:bg-darkgrey hover:text-white dark:hover:bg-reallydarkgrey">Login</h1>
        </a>
    </div>
</nav>
<PageTransition {url}>
    <div class="grid place-items-center m-4 place-content-center">
        <slot />
    </div>
</PageTransition>