import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    code: {
        type: String, 
        unique: true,
        required: true,
        // index: true // not needed because of unique
    },
    price: {
        type: Number, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    status: {
        type: Boolean, 
        default: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        index: "text" // to search within this kind of values
    },
    thumbnail: String
},{ timestamps: true });
productSchema.plugin(paginate);
const Product = mongoose.model("Product", productSchema);
export default Product;