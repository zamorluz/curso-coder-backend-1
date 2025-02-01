import request from "supertest";
import fs from "fs";
/**
 * @type {express}
 */
import app from "../../src/app.js";
import Cart from "../../src/models/Cart.js";
import Product from "../../src/models/Product.js";

test('ProductRouter.get', async () => {
  if(fs.existsSync(Cart.data_path)){
    fs.unlink(Cart.data_path, () => {});
  }
  if(fs.existsSync(Product.data_path)){
    fs.unlink(Product.data_path, () => {});
  }
  let response = await request(app).get("/api/products");
  response = response.body;
  expect(response.length).toBe(0);
});

test('ProductRouter.put', async () => {
  let req = await request(app).put("/api/products").send({}),
    status = req.status,
    response = req.body;
  
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.errors.title !== typeof undefined).toBe(true);
  expect(typeof response.errors.code !== typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(6);

  req = await request(app).put("/api/products").send({
    title: "test product 1"
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code !== typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(5);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(4);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(3);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price === typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(2);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price === typeof undefined).toBe(true);
  expect(typeof response.errors.stock === typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(1);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
    category: "test",
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(201);
  expect(typeof response.errors === typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.title !== typeof undefined).toBe(true);
  expect(typeof response.payload.description !== typeof undefined).toBe(true);
  expect(typeof response.payload.code !== typeof undefined).toBe(true);
  expect(typeof response.payload.price !== typeof undefined).toBe(true);
  expect(typeof response.payload.status !== typeof undefined).toBe(true);
  expect(typeof response.payload.stock !== typeof undefined).toBe(true);
  expect(typeof response.payload.category !== typeof undefined).toBe(true);
  expect(typeof response.payload.thumbnail !== typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 201).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(true);

  req = await request(app).put("/api/products").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
    category: "test",
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 422).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(false);
});

test('ProductRouter.get.pid', async () => {
  let req = await request(app).get("/api/products/1"),
    status = req.status,
    response = req.body;
  expect(status).toBe(200);
  expect(typeof response.errors === typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.title !== typeof undefined).toBe(true);
  expect(typeof response.payload.description !== typeof undefined).toBe(true);
  expect(typeof response.payload.code !== typeof undefined).toBe(true);
  expect(typeof response.payload.price !== typeof undefined).toBe(true);
  expect(typeof response.payload.status !== typeof undefined).toBe(true);
  expect(typeof response.payload.stock !== typeof undefined).toBe(true);
  expect(typeof response.payload.category !== typeof undefined).toBe(true);
  expect(typeof response.payload.thumbnail !== typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 200).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(true);
  expect(response.payload.id).toBe(1);
  expect(response.payload.title).toBe("test product 1");
  expect(response.payload.code).toBe('test-product-1');
  expect(response.payload.description).toBe('test-product-1');
});

test('ProductRouter.patch', async () => {
  let req = await request(app).patch("/api/products/1").send({}),
    status = req.status,
    response = req.body;
  
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.errors.title !== typeof undefined).toBe(true);
  expect(typeof response.errors.code !== typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(6);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1"
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code !== typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(5);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-1',
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description !== typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(4);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price !== typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(3);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price === typeof undefined).toBe(true);
  expect(typeof response.errors.stock !== typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(2);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.errors.title === typeof undefined).toBe(true);
  expect(typeof response.errors.code === typeof undefined).toBe(true);
  expect(typeof response.errors.description === typeof undefined).toBe(true);
  expect(typeof response.errors.price === typeof undefined).toBe(true);
  expect(typeof response.errors.stock === typeof undefined).toBe(true);
  expect(typeof response.errors.category !== typeof undefined).toBe(true);
  expect(Object.keys(response.errors).length).toBe(1);

  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
    category: "test",
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(200);
  expect(typeof response.errors === typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.title !== typeof undefined).toBe(true);
  expect(typeof response.payload.description !== typeof undefined).toBe(true);
  expect(typeof response.payload.code !== typeof undefined).toBe(true);
  expect(typeof response.payload.price !== typeof undefined).toBe(true);
  expect(typeof response.payload.status !== typeof undefined).toBe(true);
  expect(typeof response.payload.stock !== typeof undefined).toBe(true);
  expect(typeof response.payload.category !== typeof undefined).toBe(true);
  expect(typeof response.payload.thumbnail !== typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 200).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(true);

  req = await request(app).patch("/api/products/asd").send({
    title: "test product 1",
    code: 'test-product-1',
    description: 'test-product-1',
    price: 15,
    stock: 10,
    category: "test",
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.errors.id !== typeof undefined).toBe(true);
  expect(response.status === 422).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(false);


  const product = new Product(
    2, 
    "test product 2",
    'test-product-2',
    'test-product-2',
    10,
    false,
    10
  );
  product.save()
  req = await request(app).patch("/api/products/1").send({
    title: "test product 1",
    code: 'test-product-2',
    description: 'test-product-1',
    price: 15,
    stock: 10,
    category: "test",
  });
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.errors.code !== typeof undefined).toBe(true);
  expect(response.status === 422).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(false);
});




test('ProductRouter.delete.pid', async () => {
  let req = await request(app).delete("/api/products/1"),
    status = req.status,
    response = req.body;
  expect(status).toBe(200);
  expect(typeof response.errors === typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.deleted !== typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 200).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(true);
  expect(response.payload.deleted).toBe(true);

  req = await request(app).delete("/api/products/1");
  status = req.status;
  response = req.body;
  expect(status).toBe(422);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.errors.id !== typeof undefined).toBe(true);
  expect(typeof response.payload === typeof undefined).toBe(true);
  expect(typeof response.status !== typeof undefined).toBe(true);
  expect(response.status === 422).toBe(true);
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(response.success).toBe(false);
});




test('Cart.get', async () => {

  let response = await request(app).get("/api/carts");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.errors !== typeof undefined).toBe(false);
  expect(response.payload.length).toBe(0);
}); 

test('Cart.post', async () => {
  let response = await request(app).post("/api/carts");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.products !== typeof undefined).toBe(true);
  expect(response.payload.products.length).toBe(0);
  expect(typeof response.errors !== typeof undefined).toBe(false);
}); 

test('Cart.get.cid', async () => {
  let response = await request(app).get("/api/carts/1");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.products !== typeof undefined).toBe(true);
  expect(response.payload.products.length).toBe(0);
  expect(typeof response.errors !== typeof undefined).toBe(false);

  response = await request(app).get("/api/carts/asd");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(false);
  expect(typeof response.errors !== typeof undefined).toBe(true);
}); 

test('Cart.post.product', async () => {
  let product = Product.findByID(2);
  product.status = true;
  product.save();
  let response = await request(app).post("/api/carts/1/product/2");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.products !== typeof undefined).toBe(true);
  expect(response.payload.products.length).toBe(1);
  expect(typeof response.payload.products[0].product_id !== typeof undefined).toBe(true);
  expect(typeof response.payload.products[0].qty !== typeof undefined).toBe(true);
  expect(response.payload.products[0].product_id).toBe(2);
  expect(typeof response.errors !== typeof undefined).toBe(false);

  response = await request(app).get("/api/carts/asd");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(false);
  expect(typeof response.errors !== typeof undefined).toBe(true);
}); 

test('Cart.delete.product', async () => {
  let response = await request(app).delete("/api/carts/1/product/2");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.id !== typeof undefined).toBe(true);
  expect(typeof response.payload.products !== typeof undefined).toBe(true);
  expect(response.payload.products.length).toBe(0);
  expect(typeof response.errors !== typeof undefined).toBe(false);

  response = await request(app).delete("/api/carts/asd/product/asd");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(false);
  expect(typeof response.errors !== typeof undefined).toBe(true);
  expect(typeof response.errors.product !== typeof undefined).toBe(true);
  expect(typeof response.errors.cart !== typeof undefined).toBe(true);

  response = await request(app).get("/api/carts/asd");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(false);
  expect(typeof response.errors !== typeof undefined).toBe(true);
}); 

test('Cart.delete', async () => {
  let response = await request(app).delete("/api/carts/1");
  response = response.body;
  expect(typeof response.success !== typeof undefined).toBe(true);
  expect(typeof response.payload !== typeof undefined).toBe(true);
  expect(typeof response.payload.deleted !== typeof undefined).toBe(true);
  expect(response.payload.deleted).toBe(false);
  expect(typeof response.errors !== typeof undefined).toBe(false);
}); 
