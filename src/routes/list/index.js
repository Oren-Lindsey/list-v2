import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as cookie from 'cookie'
const saltRounds = 10;
const adminPassword = process.env['ADMIN_PASSWORD']
const db_url = process.env["DB_URL"]
import { Item } from '../../lib/itemschema'
import { Password } from '../../lib/passwordschema'
const name = process.env['NAME']
/** @type {import('./__types/[id]').RequestHandler} */
export async function get(event) {
    await genPassword(adminPassword)
    const cookieheader = await event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    const valid = await checkLoggedIn(submitted)
    const sort = await event.url.searchParams.get('sort')
    const items = await getItems(sort)
    return {
        body: {
            name: name,
            items: items,
            loggedIn: valid
        }
    }
}
async function checkLoggedIn(password) {
    if (password !== undefined && password !== null) {
        const result = await comparePassword(password)
        return result
    } else {
        return false
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
async function genPassword(plaintext) {
    const hash = await bcrypt.hash(plaintext, saltRounds)
    await mongoose.connect(db_url);
    const passwords = await Password.find()
    if (passwords.length < 1) {
        const storedPassword = new Password({ hash: hash })
        await storedPassword.save();
    } else if (passwords.length == 1) {
        //if you change .env
        const valid = await bcrypt.compare(adminPassword, passwords[0].hash)
        if (!valid) {
            console.log('dropping...')
            await Password.deleteMany()
            const storedPassword = new Password({ hash: hash })
            await storedPassword.save();
        }
    }
}
async function comparePassword(plaintext) {
    await genPassword(adminPassword)
    await mongoose.connect(db_url)
    const password = await Password.find()
    if (password.length > 1) {
        return false
    } else {
        const valid = await bcrypt.compare(plaintext, password[0].hash)
        return valid
    }
}