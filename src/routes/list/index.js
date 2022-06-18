import 'dotenv/config'
import mongoose from 'mongoose'
const db_url = process.env["DB_URL"]
import { Item } from '../../lib/itemschema'
/** @type {import('./__types/[id]').RequestHandler} */
export async function get(event) {
    const sort = await event.url.searchParams.get('sort')
    const items = await getItems(sort)
    return {
        body: {
            items: items,
            loggedIn: false
        }
    }
}
async function getItems(sort) {
    await mongoose.connect(db_url)
    if (sort == null || sort == 'all') {
        const items = await Item.find()
        return items
    } else if (sort == 'asc') {
        const query = Item.find({})
        const items = await query.sort('price');
        return items
    } else if (sort == 'desc') {
        const query = Item.find({})
        const items = await query.sort('-price');
        return items
    } else if (sort == 'checked') {
        const items = await Item.find({ checked: true })
        return items
    } else if (sort == 'unchecked') {
        const items = await Item.find({ checked: false })
        return items
    } else if (sort == 'ranking-asc') {
        const query = Item.find({})
        const sorted = await query.sort('ranking')
        return sorted
    } else if (sort == 'ranking-desc') {
        const query = Item.find({})
        const sorted = await query.sort('-ranking')
        return sorted
    } else {
        const items = await getItems('all')
        return items
    }
}