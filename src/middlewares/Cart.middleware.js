import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import __response from "../services/http.service.js";

export const cartProductMiddleware = (request,response, next) => {
    let errors = {};
    if(!Product.isProduct(Product.findByID(request.params.pid))){
        errors.product = "the product does not exists";
    }
    if(!Cart.isCart(Cart.findByID(request.params.cid))){
        errors.cart = "the cart does not exists";
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

