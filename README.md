# list-v2
A website for my christmas list, using mongodb and sveltekit
## Features
- Login and add items from the web
- check off items without being logged in
- log in and delete items
## To deploy
It requires 2 environment variables:
- `DB_URL`: the url of your mongodb instance, whether it's atlas or local
- `ADMIN_PASSWORD`: the password to get into the admin features (adding and deleteing items)

Set these two using you preferred environment variable method. Just ensure they are accessible through `process.env`. So you can use `dotenv` or something like vercel's environment variables
