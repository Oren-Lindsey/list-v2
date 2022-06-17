import 'dotenv/config'
import mongoose from 'mongoose'
const db_url = process.env["DB_URL"]
import { Item } from '../../lib/itemschema'
const name = process.env['NAME']
/** @type {import('./__types/[id]').RequestHandler} */
export async function post(e) {
    const json = await e.request.json()
    const item = await toggleItem(json)
    return {
        body: item
    }
}
async function toggleItem(data) {
    await mongoose.connect(db_url)
    const item = await Item.findOne({ _id: data.id })
    item.checked = !item.checked
    await item.save()
    return item
}