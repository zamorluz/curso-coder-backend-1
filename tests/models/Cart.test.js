import fs from "fs";
import Cart from '../../src/models/Cart.js';
import Product from "../../src/models/Product.js";


test('Cart.test_defaults', async () => {
  if(fs.existsSync(Cart.data_path)){
    fs.unlink(Cart.data_path, () => {});
  }
  if(fs.existsSync(Product.data_path)){
    fs.unlink(Product.data_path, () => {});
  }
  let product = new Cart();
  expect(product.id).toBe(1);
  expect(product.products.length).toBe(0);
});


test('Cart.setID', async () => {
  let cart = new Cart();
  cart.setID()
  expect(cart.id).toBe(1);
  cart.setID(2)
  expect(cart.id).toBe(2);
  cart.setID('asd')
  expect(cart.id).toBe(1);
  cart.setID('asd3')
  expect(cart.id).toBe(3);
});



test('Cart.addProduct', async () => {
  if(fs.existsSync(Cart.data_path)){
    fs.unlink(Cart.data_path, () => {});
  }
  let cart = new Cart();
  expect(cart.id).toBe(1);
  try{
    cart.addProduct();
  }catch(error){
    expect(error.message).toBe("if you want to add a product, it should be an instance of it. value: undefined");
  }
  try{
    cart.addProduct('asd');
  }catch(error){
    expect(error.message).toBe("if you want to add a product, it should be an instance of it. value: string");
  }
  const product = new Product(
    1, 
    'Cart test 1',
    "description",
    'cart-test-1',
    10,
    false,
    10
  );

  try{
    cart.addProduct(product);   
  }catch(error){
    expect(error.message).toBe(`the product you want to add is disabled`);
  }
  product.setStatus(true);
  product.save();

  cart.addProduct(product);  
  expect(cart.products.length).toBe(1);
  expect(cart.products[0].product_id).toBe(1);
  expect(cart.products[0].qty).toBe(1);
  cart.addProduct(product,2);
  expect(cart.products.length).toBe(1);
  expect(cart.products[0].product_id).toBe(1);
  expect(cart.products[0].qty).toBe(3);
  cart.addProduct(product,10);
  expect(cart.products.length).toBe(1);
  expect(cart.products[0].product_id).toBe(1);
  expect(cart.products[0].qty).toBe(10);

  const product2 = new Product(
    2, 
    'Cart test 2',
    "description",
    'cart-test-2',
    10,
    true,
    10
  );
  cart.addProduct(product2,11);
  expect(cart.products.length).toBe(2);
  expect(cart.products[1].product_id).toBe(2);
  expect(cart.products[1].qty).toBe(10);
});

test('Cart.deleteProduct', async () => {
  let cart = Cart.findByID(1),
    product = Product.findByID(1);
  expect(Cart.isCart(cart)).toBe(true);
  expect(cart.products.length).toBe(2);
  expect(cart.products[0].product_id).toBe(1);
  expect(cart.products[1].product_id).toBe(2);
  try{
    cart.deleteProduct('asd');
  }catch(error){
      expect(error.message).toBe('if you want to add a product, it should be an instance of it. value: string');
  }
  let deleted = cart.deleteProduct(product);
  expect(deleted).toBe(true);
  expect(cart.products.length).toBe(1);

  const product3 = new Product(
    3, 
    'Cart test 3',
    "description",
    'cart-test-3',
    10,
    true,
    10
  );
  product.save();
  expect(cart.deleteProduct(product3)).toBe(true);
});

test('Cart.getAll', async () => {
  const carts = Cart.getAll();
  expect(carts.length).toBe(1);
  expect(Cart.isCart(carts[0])).toBe(true);
});

test('Cart.delete', async () => {
  const cart = Cart.findByID(1);
  expect(Cart.isCart(cart)).toBe(true);
  expect(Cart.items.length).toBe(1);
  expect(cart.delete()).toBe(true);
  expect(Cart.items.length).toBe(0);
  expect(cart.delete()).toBe(true);
});
