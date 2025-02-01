import Product from "../models/Product.js";
import __response from "../services/http.service.js";
const checkRequest = (request) => {
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
    return errors;
}

export const productAddMiddleware = (request,response, next) => {
    const {code} = request.body;
    let errors = checkRequest(request);
    if(Product.isProduct(Product.findByCode(code))){
        errors.code = "there is a product with that code";
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
};

export const productEditMiddleware = (request, response, next) => {
    let errors = checkRequest(request);
    const id = request.params.pid,
        {code} = request.body;
    let product = Product.findByID(id);
    const productExists = Product.isProduct(product);
    if(!productExists){
        errors.id = "the product does not exists with that ID";
    }
    let productCodeCheck = productExists ? Product.findByCode(code) : null;
    if(productCodeCheck !== null && Product.isProduct(productCodeCheck) && productCodeCheck.id != product.id){
        errors.code = "the product code is already in use"
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
}
export const productDeleteMiddleware = (request, response, next) => {
    const id = request.params.pid;
    let product = Product.findByID(id),
        errors = {};
    if(product === null || !Product.isProduct(product)){
        errors.id = "the product does not exists with that ID";
    }
    if(Object.keys(errors).length > 0){
        return response.status(422).send(__response(errors, 422));
    }
    next();
}