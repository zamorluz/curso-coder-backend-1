import express from "express";
import Product from "../models/Product.model.js";
import { 
    productIdIsValidMiddleware, 
    productShouldExistByIdMiddleware,
    productShouldNotExistByCodeMiddleware,
    productCheckRequest, 
    productEditMiddleware
} from "../middlewares/Product.middleware.js";
import __response from "../services/http.service.js";

const productRouter = express.Router();

productRouter.get("/", async (request, response) => {
    const page = parseInt(request.query.page) || 1,
        limit = parseInt(request.query.limit) || 1,
        sort = parseInt(request.query.sort) || 1,
        sortBy = request.query.sortBy || '_id';
    let sortClause = {};
    sortClause[sortBy] = sort;
    const products = await Product.paginate({},{
        page,
        limit,
        sort: sortClause,
        lean: true // to not bring the extra methods & stuff
    });
    return response.status(201).send(__response(products, 201)); 
});

productRouter.get("/:pid", productIdIsValidMiddleware,  productShouldExistByIdMiddleware, async (request, response) => {
    try{
        const product = await Product.findByID(request.params.pid);
        return response.status(200).send(__response(product,200));   
    }catch(error){
        return response.status(500).send(__response(error,500));   
    }
});

productRouter.put("/", productShouldNotExistByCodeMiddleware, productCheckRequest, async  (request, response) => {
    try{
        const {
            title, 
            description, 
            code, 
            price, 
            status = true, 
            stock, 
            category,
            thumbnail = null
        } = request.body;
        const product = new Product({
            title, 
            description, 
            code, 
            price, 
            status, 
            stock, 
            category,
            thumbnail
        });
        product.save(); 
        return response.status(201).send(__response(product, 201));   
    }catch(error){
        return response.status(500).send(__response(error, 500));   
    }
});
productRouter.patch("/:pid", productIdIsValidMiddleware, productShouldExistByIdMiddleware, productCheckRequest, productEditMiddleware, async (request, response) => {
    try{
        const id = request.params.pid;
        const {
            title, 
            description, 
            code, 
            price, 
            status = true, 
            stock, 
            category,
            thumbnail = null
        } = request.body;
        /**
         * @type Product
         */
        let product = await Product.findById(id);
        product.title = title;
        /**
         * @todo do a model for this and the relation
         */
        product.category = category;
        product.description = description;
        product.code = code;
        product.price = price;
        product.stock = stock;
        product.status = status;
        product.thumbnail = thumbnail === null ? product.thumbnail : thumbnail;
        product.save()
        const io = request.app.get('socketio');
        io.emit("product.update", product);
        return response.status(200).send(__response(product, 200));   
    }catch(error){
        return response.status(500).send(__response(error, 500)); 
    }
});
productRouter.delete("/:pid", productIdIsValidMiddleware, productShouldExistByIdMiddleware, async(request, response) => {
    try{
        const id = request.params.pid;
        await Product.deleteOne({
            _id: id
        });
        const io = request.app.get('socketio');
        io.emit("product.delete", id);
        return response.status(200).send(__response({
            deleted: (await Product.findById(id)) === null
        }, 200));   
    }catch(error){
        return response.status(500).send(__response(error, 500)); 
    }
});

export default productRouter;