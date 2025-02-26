import express from "express";
import __response from "../services/http.service.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { cartIdIsValidMiddleware, cartExistsMiddleware } from "../middlewares/Cart.middleware.js";
import { productIdIsValidMiddleware, productShouldExistByIdMiddleware } from "../middlewares/Product.middleware.js";

const cartRouter = express.Router();



cartRouter.get("/", async (request, response) => {
    try{
        const page = parseInt(request.query.page) || 1,
            limit = parseInt(request.query.limit) || 1;
        const products = await Cart.paginate({},{
            page,
            limit,
            lean: true // to not bring the extra methods & stuff
        });
        return response.status(201).send(__response(products, 201));    
    }catch(error){
        return response.status(500).send(__response(error,500));   
    }
});

cartRouter.post("/", async (request, response) => {
    try{
        const cart = await Cart.insertOne();
        return response.status(200).send(__response(cart,200));   
    }catch(error){
        return response.status(500).send(__response(error,500));   
    }
});

cartRouter.get("/:cid", cartIdIsValidMiddleware, cartExistsMiddleware, async (request, response) => {
    try{
        const cart = await Cart.findById(request.params.cid),
            io = request.app.get('socketio');
        io.emit("cart.update", cart.products);
        return response.status(200).send(__response(cart,200));   
    }catch(error){
        return response.status(500).send(__response(error,500));   
    }
});

cartRouter.delete("/:cid", cartIdIsValidMiddleware, cartExistsMiddleware, async (request, response) => {
    try{
        const cart = await Cart.findById(request.params.cid);
        cart.delete();
        return response.status(200).send(__response({
            deleted : (await Cart.findById(request.params.cid)) === null
        },200));   
    }catch(error){
        return response.status(500).send(__response(error,500));   
    }
});

cartRouter.post("/:cid/product/:pid", cartIdIsValidMiddleware, cartExistsMiddleware, productIdIsValidMiddleware, productShouldExistByIdMiddleware, async (request, response) => {
    const cart = await Cart.findById(request.params.cid),
        product = await Product.findById(request.params.pid),
        qty = parseInt(request.body.qty); // we wont check this in case we want to delete by number of units
        
    let exists = false;
    for(let z = 0; z < cart.products.length ; z++){
        if(cart.products[z].product.equals(product._id)){
            cart.products[z].qty += qty;
            exists = true;
        }
    }
    if(!exists && qty > 0){
        cart.products.push({
            product,
            qty
        });
    }
    cart.save();
    product.stock -= qty;
    product.save();
    const io = request.app.get('socketio');
    io.emit("product.update", product);
    io.emit("cart.update", cart.products);
    response.status(200).send(__response({cart},200));
});

cartRouter.delete("/:cid/product/:pid", cartIdIsValidMiddleware, cartExistsMiddleware,productIdIsValidMiddleware, productShouldExistByIdMiddleware, async (request, response) => {
    const cart = await Cart.findById(request.params.cid),
        product = await Product.findById(request.params.pid);
    let qty = 0;
    for(let z = 0; z < cart.products.length ; z++){
        if(cart.products[z].product.equals(product._id)){
            qty = cart.products[z].qty;
        }
    }
    const index = cart.products.findIndex(element => element.product.equals(product._id))
    cart.products.splice(index, 1);
    cart.save();
    product.stock -= qty;
    product.save();
    const io = request.app.get('socketio');
    io.emit("product.update", product);
    io.emit("cart.update", cart.products);
    response.status(200).send(__response(cart,200));
});
export default cartRouter;