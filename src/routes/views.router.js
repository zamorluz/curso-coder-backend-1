import express from "express";
import __response from "../services/http.service.js";
import Product from "../models/Product.model.js";
import mongoose from "mongoose";

const viewsRouter = express.Router();
viewsRouter.get("/", async (request, response) => {
    const page = parseInt(request.query.page) || 1,
        limit = parseInt(request.query.limit) || 12;
    // this is only here because of the homework
    // in any other case i would bring the products via a fetch request to the api endpoint
    // there is no sense into having this declared in two places
    const products = await Product.paginate({},{
        page,
        limit,
        lean: true // to not bring the extra methods & stuff
    });
    response.render("home",{products, pages: [...Array(products.totalPages).keys()].map(i => {
        return {
            current: i + 1 === products.page,
            page: i + 1
        }
    })});
});
viewsRouter.get("/products", async (request, response) => {
    const page = parseInt(request.query.page) || 1,
        limit = parseInt(request.query.limit) || 12;
    // this is only here because of the homework
    // in any other case i would bring the products via a fetch request to the api endpoint
    // there is no sense into having this declared in two places
    const products = await Product.paginate({},{
        page,
        limit,
        lean: true // to not bring the extra methods & stuff
    });
    response.render("products/list",{products, pages: [...Array(products.totalPages).keys()].map(i => {
        return {
            current: i + 1 === products.page,
            page: i + 1
        }
    })});
});
viewsRouter.get("/products/:pid", async (request, response) => {
    //we are going manual just in case we receive code or id
    const product = mongoose.Types.ObjectId.isValid(request.params.pid) ? await Product.findById(request.params.pid) : await Product.findOne({code: request.params.pid});
    if(product === null){
        // what a bother to do a error page
        return response.status(404).send(__response({
            errors: {
                product: "does not exists"
            }
        }, 404));
    }
    response.render("products/detail",product);
});

export default viewsRouter;