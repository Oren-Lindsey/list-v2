import 'dotenv/config'
import bcrypt from 'bcryptjs'
import * as cookie from 'cookie'
const saltRounds = 10;
import mongoose from 'mongoose'
const db_url = process.env["DB_URL"]
const adminPassword = process.env['ADMIN_PASSWORD']
const allowedHrefs = ['u.cubeupload.com', 'i.imgbb.com', 'm.media-amazon.com']
import 'url/URL'
import { Item } from '../../lib/itemschema'
import { Password } from '../../lib/passwordschema'
/** @type {import('./__types/[id]').RequestHandler} */
export async function post(event) {
    await genPassword(adminPassword)
    const cookieheader = await event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    if (submitted !== undefined && submitted !== null) {
        const result = await comparePassword(submitted)
        if (result) {
            const json = await event.request.json()
            const item = await addItem(json)
            return {
                body: item
            }
        } else {
            return {
                status: '403'
            }
        }
    } else {
        return {
            status: 404
        }
    }
}
export async function get({ request }) {
    await genPassword(adminPassword)
    const cookieheader = await request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    if (submitted !== undefined) {
        const result = await comparePassword(submitted)
        if (!result) {
            return {
                status: '302',
                headers: {
                    Location: '/login'
                }
            }
        } else {
            return {
                status: '200'
            }
        }
    } else {
        return {
            status: 404
        }
    }
}
async function addItem(data) {
    await mongoose.connect(db_url)
    try {
        const imgUrl = new URL(data.img)
        if (!allowedHrefs.includes(imgUrl.hostname) && !allowedHrefs.includes('*')) {
            data.img = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
            //to stop pesky image xss, if you want you can add '*' to the array above and it'll let anything through
        }
    } catch (error) {
        data.img = 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
    }
    const item = new Item({
        name: data.name,
        description: data.description,
        img: data.img,
        price: data.price,
        link: data.link,
        checked: false,
        size: data.size,
        ranking: data.ranking
    })
    await item.save()
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