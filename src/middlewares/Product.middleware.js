import Product from "../models/Product.model.js";
import __response from "../services/http.service.js";
import db from "mongodb";
import mongoose from "mongoose";


export const productIdIsValidMiddleware = (request, response, next) => {
    let errors = {};
    if(!mongoose.Types.ObjectId.isValid(request.params.pid)){
        errors.pid = "invalid product id";
        return response.status(422).send(__response(errors, 422));
    }
    next();
};
export const productShouldExistByIdMiddleware = async(request, response, next) => {
    let errors = {};
    let product = await Product.findById(request.params.pid);
    if(product === null){
        errors.pid = "the product does exists with that ID";
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

export const productShouldNotExistByCodeMiddleware = async (request,response, next) => {
    const {code} = request.body,
        pid = request.params.pid;
    let errors = {};
    const product = await Product.findOne({code});
    if(product !== null){
        errors.code = "there is a product with that code";
        return response.status(422).send(__response(errors, 422));
    }
    next();
};
export const productCheckRequest = async (request, response, next) => {
    const {
        title, 
        description, 
        code, 
        price, 
        stock, 
        category
    } = request.body;
    let errors = {};
    if(!title) {
        errors.title = "title is needed";
    }
    if(!description) {
        errors.description = "description is needed";
    }
    if(!code) {
        errors.code = "code is needed";
    }
    if(!price) {
        errors.price = "price is needed";
    }
    if(!stock) {
        errors.stock = "stock is needed";
    }
    if(!category) {
        errors.category = "category is needed";
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
}
export const productEditMiddleware = async (request, response, next) => {
    let errors = {};
    const id = request.params.pid,
        {code} = request.body;
    let product = await Product.findById(id);
    let productCodeCheck =  await Product.findOne({code});
    if(productCodeCheck !== null && productCodeCheck.id != product.id){
        errors.code = "the product code is already in use"
        return response.status(422).send(__response(errors, 422));
    }
    next();
}
