<script>
    import Button from "../../lib/components/Button.svelte";
    import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
    let idx = 0
    let imgUrl = ""
    let items = [
        {id: idx++, name: `link`, url: ""}
    ];
    const flipDurationMs = 300;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
    }
    let msg = ""
    async function addItem(e) {
        try {
            const links = await getLinks()
            msg = "adding..."
            const formData = new FormData(e.target)
            const parsed = await parseFormData(formData)
            parsed.link = links
            const item = await add(parsed)
            msg = 'added'
            setTimeout(() => {
                msg = ""
            }, 1000);
        } catch (error) {
            msg = `couldn't add :(`
            setTimeout(() => {
                msg = ""
            }, 1000);
        }
    }
    function addLink() {
        items.push({id: idx++, name: `link`, url: ""})
    }
    function deleteLink(e) {
        let objIndex = items.findIndex((obj => obj.id == e.target.id.split('-')[0]));
        items.splice(objIndex, 1)
        idx++
    }
    function updateLinkUrl(e) {
        let objIndex = items.findIndex((obj => obj.id == e.target.id));
        items[objIndex].url = e.target.value
    }
    async function getLinks() {
        let parsedItems = []
        for (let i = 0; i < items.length; i++) {
            parsedItems.push({name: items[i].name, url: items[i].url})
        }
        return parsedItems
    }
    function updateLinkName(e) {
        let objIndex = items.findIndex((obj => obj.id == e.target.id.split('-')[0]));
        items[objIndex].name = e.target.value
    }
    async function parseFormData(formData) {
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        return data
    }
    async function add(data) {
        const res = await fetch('/add/__data.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await res.json()
        return json
    }
</script>
<h1 class="text-3xl pb-2 text-black dark:text-white">Add item</h1>
<form class="bg-grey dark:bg-reallydarkgrey grid place-items-center p-4 border border-black dark:border-grey rounded-md break-words w-lg max-w-lg" on:submit|preventDefault={addItem}>
    <label class="text-darkgrey mb-2 dark:text-grey" for="name">Name:</label> 
    <input type="text" name="name" id="name" placeholder="name" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <label class="text-darkgrey my-2 dark:text-grey" for="description">Description:</label>
    <input type="text" name="description" id="description" placeholder="description" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <label class="text-darkgrey my-2 dark:text-grey" for="price">Price (in dollars):</label>
    <input type="number" step="1" min="0" name="price" id="price" placeholder="price" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <p class="text-darkgrey my-2 dark:text-grey">Links:</p>
    <div class="border-2 border-darkgrey bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey grid place-items-center">
    {#key idx}
    <ul use:dndzone="{{items, flipDurationMs}}" on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}" class="min-h-full min-w-full">
        {#if items.length > 0}
                {#each items as item(item.id)}
                    <li class="border-2 border-dashed p-2 rounded-md border-extradarkgrey mb-2 dark:border-grey" animate:flip="{{duration: flipDurationMs}}"><button type="button" class="text-black dark:text-white" id="{item.id}-delete" on:click={deleteLink}>X</button> <i class="text-darkgrey dark:text-grey">remove</i><p>name</p><input type="text" id="{item.id}-value" value={item.name} class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" on:input={updateLinkName} /><p>url</p><input type="text" id="{item.id}" class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" value={item.url} on:input={updateLinkUrl} /></li>
                {/each}
        {:else}
        <li class="p-2 rounded-md mb-2">
            No links :(
        </li>
        {/if}
    </ul>
    {/key}
    <button class="transition ease-in-out delay-75 bg-theme text-black font-sans rounded p-1 hover:bg-darkgrey hover:text-white dark:bg-darkgrey dark:hover:bg-extradarkgrey dark:text-white" on:click|preventDefault={addLink}>Add link</button>
    </div> 
    <label class="text-darkgrey my-2 dark:text-grey" for="img">Image url:</label>
    <input type="text" name="img" id="img" placeholder="image link" bind:value={imgUrl} required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    {#key imgUrl}
    {#if imgUrl !== ""}
    <img src={imgUrl} alt="preview" />
    {/if}
    {/key}
    <label class="text-darkgrey my-2 dark:text-grey" for="size">Size (optional):</label>
    <input type="text" name="size" id="size" placeholder="size" class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <label class="text-darkgrey my-2 dark:text-grey" for="size">Priority (1-10):</label>
    <input type="number" min="1" max="10" name="ranking" id="ranking" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2 dark:bg-extradarkgrey dark:text-grey dark:border-grey" />
    <Button type="submit" href="">Add</Button> <p class="text-darkgrey pt-2 dark:text-grey">{msg}</p>
</form>