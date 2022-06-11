import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
    hash: String
});
const Password = mongoose.model("Password", passwordSchema);
export { Password };