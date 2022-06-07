<script>
    import Button from "../../lib/components/Button.svelte";
    let msg = ""
    async function addItem(e) {
        try {
            msg = "adding..."
            const formData = new FormData(e.target)
            const parsed = await parseFormData(formData)
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
<h1 class="text-3xl pb-2">Add item</h1>
<form class="bg-grey grid place-items-center p-4 border border-black rounded-md break-words w-lg max-w-lg" on:submit|preventDefault={addItem}>
    <label class="text-darkgrey mb-2" for="name">Name:</label> 
    <input type="text" name="name" id="name" placeholder="name" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2" />
    <label class="text-darkgrey my-2" for="description">Description:</label>
    <input type="text" name="description" id="description" placeholder="description" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2" />
    <label class="text-darkgrey my-2" for="price">Price (in dollars):</label>
    <input type="number" step="1" min="0" name="price" id="price" placeholder="price" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2" />
    <label class="text-darkgrey my-2" for="link">Link to product page:</label>
    <input type="text" name="link" id="link" placeholder="link" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2" />
    <label class="text-darkgrey my-2" for="img">Image url (must be from imgbb, cubeupload, or amazon):</label>
    <input type="text" name="img" id="img" placeholder="image link" required class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2" />
    <label class="text-darkgrey my-2" for="size">Size (optional):</label>
    <input type="text" name="size" id="size" placeholder="size" class="border-darkgrey border-2 bg-grey rounded-md p-1 pl-2 mb-2" />
    <Button type="submit" href="">Add</Button> <p class="text-darkgrey pt-2">{msg}</p>
</form>