import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as cookie from 'cookie'
const saltRounds = 10;
const adminPassword = process.env['ADMIN_PASSWORD']
const db_url = process.env["DB_URL"]
import { Item } from '../../../lib/itemschema'
import { Password } from '../../../lib/passwordschema'
/** @type {import('./__types/[id]').RequestHandler} */
export async function get(event) {
    await genPassword(adminPassword)
    const cookieheader = await event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    const valid = await checkLoggedIn(submitted)
    const id = await event.params.id
    const exists = await checkIfItemExists(id)
    if (exists) {
        const item = await getItem(id)
        return {
            body: {
                item: item,
                loggedIn: valid 
            }
        }
    } else {
        return {
            status: 404
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
export async function del(event) {
    await genPassword(adminPassword)
    const cookieheader = await event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    if (submitted !== undefined && submitted !== null) {
        const valid = await comparePassword(submitted)
        if (valid) {
            const id = await event.params.id
            const exists = await checkIfItemExists(id)
            if (exists) {
                await deleteItem(id)
                return {
                    body: {
                        deleted: true
                    }
                }
            } else {
                return {
                    status: 404
                }
            }
        } else {
            return {
                status: 403
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
    const item = await Item.exists({ _id: id })
    if (item) {
        return true
    } else {
        return false
    }
}
async function getItem(id) {
    await mongoose.connect(db_url)
    const item = await Item.findOne({ _id: id })
    return item
}
async function deleteItem(id) {
    await mongoose.connect(db_url)
    const item = await Item.findOneAndDelete({ _id: id })
    return item
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