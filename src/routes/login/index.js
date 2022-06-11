import 'dotenv/config'
import bcrypt from 'bcrypt'
import * as cookie from 'cookie'
const saltRounds = 10;
import mongoose from 'mongoose'
const db_url = process.env["DB_URL"]
const adminPassword = process.env['ADMIN_PASSWORD']
import { Password } from '../../lib/passwordschema'
/** @type {import('./__types/[id]').RequestHandler} */
export async function get(event) {
    await genPassword(adminPassword)
    const cookieheader = await event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieheader || '');
    const submitted = cookies['password']
    if (submitted !== undefined && submitted !== null) {
        const valid = await comparePassword(submitted)
        if (valid) {
            return {
                status: 301,
                headers: {
                    Location: '/add',
                    'Set-Cookie':  `password=${submitted}; path=/add`,
                    'Set-Cookie': `password=${submitted}; path=/login`,
                    'Set-Cookie': `password=${submitted}; path=/list`,
                    'Set-Cookie': `password=${submitted};`,
                }
            }
        } else {
            return {
                status: 200
            }
        }
    } else {
        return {
            status: 200
        }
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