import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                qty: Number
            }
        ],
        default: []
    }
},{ timestamps: true });

cartSchema.plugin(paginate);
cartSchema.pre(["find", "findOne","findById"], function (next){
    this.populate("products.product");
    next();
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;