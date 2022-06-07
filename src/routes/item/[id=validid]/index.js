import 'dotenv/config'
import mongoose from 'mongoose'
import { get_all_dirty_from_scope } from 'svelte/internal'
const db_url = process.env["DB_URL"]
import { Item } from '../../../lib/itemschema'
const name = process.env['NAME']
/** @type {import('./__types/[id]').RequestHandler} */
export async function get(event) {
    const id = await event.params.id
    const exists = await checkIfItemExists(id)
    if (exists) {
        const item = await getItem(id)
        return {
            body: {
                item: item 
            }
        }
    } else {
        return {
            status: 404
        }
    }
}
async function checkIfItemExists(id) {
    await mongoose.connect(db_url)
    const item = await Item.exists({ id: id })
    if (item) {
        return true
    } else {
        return false
    }
}
async function getItem(id) {
    await mongoose.connect(db_url)
    const item = await Item.findOne({ id: id })
    return item
}