import express from "express";
import __response from "../services/http.service.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { cartProductMiddleware } from "../middlewares/Cart.middleware.js";

const cartRouter = express.Router();



cartRouter.get("/",(request, response) => response.status(200).send(__response(Cart.getAll(),200)));

cartRouter.get("/:cid",(request, response) => {
    const cart = Cart.findByID(request.params.cid),
        status = Cart.isCart(cart) ? 200 : 404;
    response.status(status).send(__response(cart,status));
});

cartRouter.delete("/:cid",(request, response) => {
    /**
     * @type {Cart}
     */
    const cart = Cart.findByID(request.params.cid);
    const success = cart.delete(),
        status = success ? 200 : 500;
    response.status(status).send(__response({
        deleted : success
    },status));
});

cartRouter.post("/",(request, response) => {
    const cart = new Cart(),
        status = cart.save() ? 200 : 500;
    response.status(status).send(__response(cart,status));
});

cartRouter.post("/:cid/product/:pid", cartProductMiddleware, (request, response) => {
    /**
     * @type {Cart}
     */
    const cart = Cart.findByID(request.params.cid);
    /**
     * @type {Product}
     */
    const product = Product.findByID(request.params.pid);
    const success = cart.addProduct(product, request.body.qty),
        status = success ? 200 : 404;
    response.status(status).send(__response(Cart.findByID(request.params.cid),status));
});

cartRouter.delete("/:cid/product/:pid", cartProductMiddleware,(request, response) => {
    /**
     * @type {Cart}
     */
    const cart = Cart.findByID(request.params.cid);
    /**
     * @type {Product}
     */
    const product = Product.findByID(request.params.pid);
    const status = cart.deleteProduct(product) ? 200 : 404;
    response.status(status).send(__response(Cart.findByID(request.params.cid),status));
});
export default cartRouter;