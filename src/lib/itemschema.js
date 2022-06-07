import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    img: String,
    price: Number,
    link: String,
    checked: Boolean,
    size: String,
});
const Item = mongoose.model("Item", itemSchema);
export { Item };