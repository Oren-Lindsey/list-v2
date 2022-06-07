<script>
    import Button from "../../lib/components/Button.svelte";
    import { page } from '$app/stores'
    const sort = $page.url.searchParams.get('sort')
    export let items
    async function updateItem(e) {
        var msg = document.getElementById(`msg-${e.target.id.value}`)
        msg.innerHTML = 'updating...'
        try {
            const formData = new FormData(e.target)
            const parsed = await parseFormData(formData);
            const data = {}
            const checked = parsed[`checkbox-${parsed.id}`]
            if (checked == 'on') {
                data.checked = true
            } else {
                data.checked = false
            }
            data.id = parsed.id
            const res = await updateReq(data)
            msg.innerText = 'updated'
            setTimeout(() => {
                msg.innerText = ""
            }, 400);
        } catch (error) {
            msg.innerText = `couldn't update :(`
            setTimeout(() => {
                msg.innerText = ""
            }, 1000);
        }
    }
    async function parseFormData(formData) {
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        return data
    }
    async function updateReq(data) {
        const res = await fetch('/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await res.json()
        return json
    }
</script>
<h1 class="text-3xl">Oren's wishlist</h1>
{#if items.length > 1}
<i class="text-darkgrey">{items.length} items</i>
{:else if items.length == 1}
<i class="text-darkgrey">1 item</i>
{:else if items.length == 0}
<i class="text-darkgrey">no items yet :(</i>
{/if}
<form>
    <label for="sort">Sort by:</label>
    <select name="sort" id="sort">
        {#if sort == null || 'all'}
        <option value="all" selected>All</option>
        {:else}
        <option value="all">All</option>
        {/if}
        {#if sort == 'asc'}
        <option value="asc" selected>Price Low to High</option>
        {:else}
        <option value="asc">Price Low to High</option>
        {/if}
        {#if sort == 'desc'}
        <option value="desc" selected>Price High to Low</option>
        {:else}
        <option value="desc">Price High to Low</option>
        {/if}
        {#if sort == 'checked'}
        <option value="checked" selected>Claimed only</option>
        {:else}
        <option value="checked">Claimed only</option>
        {/if}
        {#if sort == 'unchecked'}
        <option value="unchecked" selected>Unclaimed only</option>
        {:else}
        <option value="unchecked">Unclaimed only</option>
        {/if}
    </select>
    <Button type="submit" href="">Sort</Button>
</form>
<br>
<ul class="mx-1 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    {#each items as item}
            <li class="m-4"> 
                <div class="bg-grey border border-black pb-5 px-5 rounded-md w-full min-w-full break-words">
                    <img src={item.img} alt={item.name} class="object-scale-down rounded-b-md rounded-t-none w-full rounded-md" />
                    <h2 class="text-xl text-theme pt-2">{item.name}</h2>
                    <p>{item.description}</p>
                    <i class="text-darkgrey">${item.price}</i>
                    {#if item.size !== ""}
                    <p class="underline decoration-solid decoration-theme decoration-2">Size: {item.size}</p>
                    {:else}
                    <p class="underline decoration-solid decoration-theme decoration-2">Size: N/A</p>
                    {/if}
                    <div class="my-2">
                        <Button type="link" href={item.link}>Link to product</Button>
                    </div>
                    <form class="mb-0" id={item._id} on:submit|preventDefault={updateItem}>
                        <input type="hidden" name="id" value={item._id} />
                        <label for="checkbox">Ordered:</label>
                        <input name={`checkbox-${item._id}`} id={`checkbox-${item._id}`} type="checkbox" checked={item.checked} class="accent-theme mr-1" />
                        <Button type="submit" href="">Update</Button>
                        <i class="text-darkgrey" id={`msg-${item._id}`}></i>
                    </form>
                    <br>
                    <Button type="link" href={`/item/${item._id}`}>Link to this item</Button>
                </div>
            </li>
    {/each}
</ul>
