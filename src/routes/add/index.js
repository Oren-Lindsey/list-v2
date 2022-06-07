import 'dotenv/config'
import mongoose from 'mongoose'
const db_url = process.env["DB_URL"]
const allowedHrefs = ['u.cubeupload.com', 'i.imgbb.com', 'm.media-amazon.com']
const allowedProtocols = ['http', 'https']
import 'url/URL'
import { Item } from '../../lib/itemschema'
/** @type {import('./__types/[id]').RequestHandler} */
export async function post(event) {
    const json = await event.request.json()
    const item = await addItem(json)
    return {
        body: item
    }
}
async function addItem(data) {
    await mongoose.connect(db_url)
    try {
        const imgUrl = new URL(data.img)
        if (!allowedHrefs.includes(imgUrl.hostname)) {
            data.img = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
        }
    } catch (error) {
        data.img = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
    }
    if (!allowedProtocols.includes(data.link.split(':')[0])) {
        data.link = 'about:blank'
    }
    const item = new Item({
        name: data.name,
        description: data.description,
        img: data.img,
        price: data.price,
        link: data.link,
        checked: false,
        size: data.size
    })
    await item.save()
    return item
}