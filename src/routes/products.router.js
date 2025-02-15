import express from "express";
import Product from "../models/Product.js";
import { 
    productAddMiddleware, 
    productEditMiddleware, 
    productDeleteMiddleware 
} from "../middlewares/Product.middleware.js";
import __response from "../services/http.service.js";

const productRouter = express.Router();

productRouter.get("/",(request, response) => response.status(200).send(Product.getAll()));

productRouter.get("/:pid",(request, response) => {
    const product = Product.findByID(request.params.pid),
        status = !Product.isProduct(product) ? 404 : 200;
    response.status(status).send(__response(product,status));
});

productRouter.put("/", productAddMiddleware, (request, response) => {
    const {
        title, 
        description, 
        code, 
        price, 
        status, 
        stock, 
        category
    } = request.body;
    const product = new Product(
        null,  
        title, 
        description, 
        code, 
        price, 
        status, 
        stock, 
        category
    );
    const success = product.save(),
        httpCode = success ? 201 : 500;
    if(success){
        const io = request.app.get('socketio');
        io.emit("product.update", product);
    }
    return response.status(httpCode).send(__response(product, httpCode));
});
productRouter.patch("/:pid", productEditMiddleware, (request, response) => {
    const id = request.params.pid;
    const {
        title, 
        description, 
        code, 
        price, 
        status, 
        stock, 
        category
    } = request.body;
    /**
     * @type Product
     */
    let product = Product.findByID(id);
    product.setTitle(title);
    product.setCategory(category);
    product.setDescription(description);
    product.setCode(code);
    product.setPrice(price);
    product.setStatus(status);
    product.setStock(stock);
    const success = product.save(),
        httpCode = success ? 200 : 500;
    if(success){
        const io = request.app.get('socketio');
        io.emit("product.update", product);
    }
    return response.status(httpCode).send(__response(product, httpCode));
});
productRouter.delete("/:pid", productDeleteMiddleware, (request, response) => {
    /**
     * @type Product
     */
    let product = Product.findByID(request.params.pid);
    const success = product.delete(),
        httpCode = success ? 200 : 500;
    
    if(success){
        const io = request.app.get('socketio');
        io.emit("product.delete", product);
    }
    return response.status(httpCode).send(__response({
        deleted: success
    }, httpCode));
});

export default productRouter;