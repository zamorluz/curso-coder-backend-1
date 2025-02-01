import fs from "fs";
import { __volumes } from "../services/files.service.js";
export default class Product {
    id = null;
    title = null;
    description = null;
    code = null;
    price = 0;
    status = true;
    stock = 0;
    category = null;
    thumbnail = null;
    static data_path = __volumes + '/data/products.json';
    static items = [];

    constructor(id = null, title = null, description = null, code = null, price = 0, status = true, stock = 0, category = null, thumbnail = null) {
        this.setID(id);
        this.setTitle(title);
        this.setDescription(description);
        this.setCode(code);
        this.setPrice(price);
        this.setStatus(status);
        this.setStock(stock);
        this.setCategory(category);
        this.setThumbnail(thumbnail);
    }

    setID(id = null) {
        this.id = id === null ? (Product.items.length + 1) : id;
        this.id = isNaN(this.id) ? parseInt(this.id.replaceAll(/[^0-9]/g, "")) : this.id;
    }

    setTitle(title = null) {
        this.title = title;
    }

    setDescription(description = null) {
        this.description = description;
    }

    setCode(code = null){
        this.code = code;
    }

    setPrice(price = 0){
        this.price = price;
        this.price = isNaN(this.price) ? parseFloat(this.price.replaceAll(/[^0-9.]/g, "")) : this.price;
        this.price = isNaN(this.price) ? 0 : this.price;
    }

    setStatus(status = true){
        this.status = status === true || status === 1 || (typeof status === 'string' && status.toLowerCase() === "true") || status === "1";
    }

    setStock(stock = 0){
        this.stock = stock;
        this.stock = isNaN(this.stock) ? parseInt(this.stock.replaceAll(/[^0-9]/g, "")) : this.stock;
        this.stock = isNaN(this.stock) ? 0 : this.stock;
    }

    setCategory(category = null){
        this.category = category;
    }

    setThumbnail(thumbnail = null){
        this.thumbnail = thumbnail;
    }

    save(){
        const products = Product.getAll();
        let index = products.findIndex(element => element.id === this.id);
        if(index < 0 ){
            Product.items.push(this);
        }else{
            Product.items[index] = this;
        }
        Product.saveAll();
        return Product.isProduct(Product.findByID(this.id));
    }

    delete(){
        const products = Product.getAll();
        let index = products.findIndex(element => element.id === this.id);
        if(index < 0 ){
            // does not exists, so is the same as deleted
            return true;
        }
        Product.items.splice(index, 1);
        Product.saveAll();
        return Product.items.findIndex(element => element.id === this.id) < 0;
    }
    
    static saveAll(){
        fs.writeFileSync(Product.data_path, JSON.stringify(Product.items));
    }

    static getAll(){
        if(Product.items.length === 0){
            if(!fs.existsSync(Product.data_path)){
                fs.writeFileSync(Product.data_path, JSON.stringify([]));
            }
            Product.items = JSON.parse(fs.readFileSync(Product.data_path));
            for(let z = 0 ; z < Product.items.length ; z++){
                const product = Product.items[z];
                Product.items[z] = new Product(
                    product.id,
                    product.title,
                    product.description,
                    product.code, 
                    product.price,
                    product.status,
                    product.stock,
                    product.category,
                    product.thumbnail
                );
            }
        }
        return Product.items;
    }

    static findByID(id){
        const products = Product.getAll();
        let index = products.findIndex(element => element.id == id);
        return index < 0 ? null : products[index];
    }

    static findByCode(code){
        const products = Product.getAll();
        let index = products.findIndex(element => element.code == code);
        return index < 0 ? null : products[index];
    }

    static isProduct(object){
        return typeof object !== typeof undefined && object !== null && Object.getPrototypeOf(object) === Product.prototype;
    }
}
