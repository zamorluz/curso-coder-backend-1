import fs from "fs";
import Product from "./Product.js";
import { __volumes } from "../services/files.service.js";
export default class Cart {
    id = null;
    products = [];
    static data_path = __volumes + '/data/carts.json';
    static items = [];

    constructor(id = null) {
        this.setID(id);
    }

    setID(id = null) {
        this.id = id === null ? (Cart.items.length + 1) : id;
        this.id = isNaN(this.id) ? parseInt(this.id.replaceAll(/[^0-9]/g, "")) : this.id;
        this.id = isNaN(this.id) ? (Cart.items.length + 1) : this.id;
    }

    addProduct(product, qty = 1){
        if(!Product.isProduct(product)){
            throw new Error(`if you want to add a product, it should be an instance of it. value: ${typeof product}`);
        }
        if(!product.status){
            throw new Error(`the product you want to add is disabled`);
        }
        let index = this.products.findIndex(element => element.product_id === product.id);
        if(index < 0 ){
            this.products.push({
                product_id : product.id,
                qty: qty > product.stock ? product.stock : qty
            });
            index = this.products.findIndex(element => element.product_id === product.id);
        }else{
            this.products[index].qty += qty;
        }
        this.products[index].qty = this.products[index].qty > product.stock ? product.stock : this.products[index].qty;
        return this.save() ;
    }

    deleteProduct(product ){
        if(!Product.isProduct(product)){
            throw new Error(`if you want to add a product, it should be an instance of it. value: ${typeof product}`);
        }
        let index = this.products.findIndex(element => element.product_id === product.id);
        if(index < 0 ){
            return true;
        }
        this.products.splice(index, 1);
        this.save();
        return this.products.findIndex(element => element.product_id === product.id) < 0;
    }


    save(){
        Cart.getAll();
        let index = Cart.items.findIndex(element => element.id === this.id);
        if(index < 0 ){
            Cart.items.push(this);
        }else{
            Cart.items[index] = this;
        }
        Cart.saveAll();
        return Cart.isCart(Cart.findByID(this.id));
    }

    delete(){
        let index = Cart.items.findIndex(element => element.id === this.id);
        if(index < 0 ){
            // does not exists, so is the same as deleted
            return true;
        }
        Cart.items.splice(index, 1);
        Cart.saveAll();
        return !Cart.isCart(Cart.findByID(this.id));
    }


    
    static getAll(){
        if(Cart.items.length === 0){
            if(!fs.existsSync(Cart.data_path)){
                fs.writeFileSync(Cart.data_path, JSON.stringify([]));
            }
            Cart.items = JSON.parse(fs.readFileSync(Cart.data_path));
            for(let z = 0 ; z < Cart.items.length ; z++){
                Cart.items[z] = new Cart(Cart.items[z].id);
                Cart.items[z].products = Cart.items[z].products;
            }
        }
        return Cart.items;
    }

    static saveAll(){
        fs.writeFileSync(Cart.data_path, JSON.stringify(Cart.items));
    }
    static findByID(id){
        const carts = Cart.getAll();
        let index = carts.findIndex(element => element.id == id);
        return index < 0 ? null : Cart.items[index];
    }

    static isCart(object){
        return typeof object !== typeof undefined && object !== null && Object.getPrototypeOf(object) === Cart.prototype
    }
}
