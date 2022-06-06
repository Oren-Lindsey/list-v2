<script context="module">
    export const load = async ({ url }) => ({ props: { url } });
</script>
<script>
    import "../app.css";
    import PageTransition from "$lib/components/PageTransition.svelte";
    export let url
</script>

<div class="grid place-items-center my-4">
    <PageTransition {url}>
        <slot />
    </PageTransition>
</div>