<script>
    import Button from '../../lib/components/Button.svelte'
    async function getCookie() {
        const password = document.getElementById('cookie').value
        document.cookie = `password=${password}; path=/add`
        document.cookie = `password=${password}; path=/login`
        document.cookie = `password=${password}; path=/list`
        document.cookie = `password=${password}; path=/item`
        window.location.href = '/add'
    }
</script>
<h1 class="text-3xl pb-2 text-black dark:text-white">Login</h1>
<form on:submit|preventDefault={getCookie} class="bg-grey dark:bg-reallydarkgrey grid place-items-center p-4 border border-black dark:border-grey rounded-md break-words w-lg max-w-lg">
    <label for="cookie" class="text-darkgrey mb-2 dark:text-grey">Password:</label>
    <input id="cookie" placeholder="admin password..." class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <Button type="submit">Submit</Button>
</form>
<p class="text-darkgrey dark:text-grey mt-2">Already logged in before? Click <Button type="link" href="/add">here</Button></p>
