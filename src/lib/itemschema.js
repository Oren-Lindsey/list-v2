import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    img: String,
    price: Number,
    link: Array,
    checked: Boolean,
    size: String,
    ranking: Number
});
const Item = mongoose.model("Item", itemSchema);
export { Item };