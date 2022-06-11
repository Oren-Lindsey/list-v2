<script>
    export let type
    export let href
</script>
{#if type === 'button'}
<button class="transition ease-in-out delay-75 bg-theme text-black font-sans rounded p-1 hover:bg-darkgrey hover:text-white dark:bg-darkgrey dark:hover:bg-extradarkgrey dark:text-white">
    <slot />
</button>
{:else if type === 'link'}
<a class="transition ease-in-out delay-75 bg-theme text-black font-sans rounded p-1 hover:bg-darkgrey hover:text-white dark:bg-darkgrey dark:hover:bg-extradarkgrey dark:text-white" href={href}>
    <slot />
</a>
{:else if type === 'submit'}
<button class="transition ease-in-out delay-75 bg-theme text-black font-sans rounded p-1 hover:bg-darkgrey hover:text-white dark:bg-darkgrey dark:hover:bg-extradarkgrey dark:text-white" type="submit">
    <slot />
</button>
{/if}