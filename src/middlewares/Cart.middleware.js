import mongoose from "mongoose";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import __response from "../services/http.service.js";


export const cartIdIsValidMiddleware = (request, response, next) => {
    let errors = {};
    if(!mongoose.Types.ObjectId.isValid(request.params.cid)){
        errors.pid = "invalid cart id";
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

export const cartExistsMiddleware = async (request, response, next) => {
    let errors = {};
    const cart = await Cart.findById(request.params.cid);
    if(cart === null){
        errors.cart = "the cart does not exists";
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

export const cartProductMiddleware = async (request,response, next) => {
    const product = await Product.findById(request.params.pid),
        cart = await Cart.findById(request.params.cid),
        qty = request.body.qty;
    if(product === null){
        errors.product = "the product does not exists";
    }
    if(product && product.stock < qty){
        errors.qty = "there is not enough stock to fulfill the cart";
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

