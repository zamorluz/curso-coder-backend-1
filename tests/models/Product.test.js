import fs from "fs";
import Product from '../../src/models/Product.js';


test('Product.test_defaults', async () => {
  if(fs.existsSync(Product.data_path)){
    fs.unlink(Product.data_path, () => {});
  }
  let product = new Product();
  expect(product.id).toBe(1);
  expect(product.title).toBe(null);
  expect(product.description).toBe(null);
  expect(product.code).toBe(null);
  expect(product.price).toBe(0);
  expect(product.status).toBe(true);
  expect(product.stock).toBe(0);
  expect(product.category).toBe(null);
  expect(product.thumbnail).toBe(null);
  expect(Product.items.length).toBe(0);
});

test('Product.setID', async () => {
  let product = new Product();
  product.setID();
  expect(product.id).toBe(1);
  product.setID(2);
  expect(product.id).toBe(2);
  product.setID(`asd3`);
  expect(product.id).toBe(3);
});

test('Product.setTitle', async () => {
  let product = new Product();
  product.setTitle();
  expect(product.title).toBe(null);
  product.setTitle(`asd`);
  expect(product.title).toBe('asd');
});

test('Product.setDescription', async () => {
  let product = new Product();
  product.setDescription();
  expect(product.description).toBe(null);
  product.setDescription(`asd`);
  expect(product.description).toBe('asd');
});

test('Product.setCode', async () => {
  let product = new Product();
  product.setCode();
  expect(product.code).toBe(null);
  product.setCode(`asd`);
  expect(product.code).toBe('asd');
});

test('Product.setPrice', async () => {
  let product = new Product();
  product.setPrice();
  expect(product.price).toBe(0);
  product.setPrice(`asd`);
  expect(product.price).toBe(0);
  product.setPrice(`asd3`);
  expect(product.price).toBe(3.0);
  product.setPrice(`asd3.0`);
  expect(product.price).toBe(3.0);
});

test('Product.setStatus', async () => {
  let product = new Product();
  product.setStatus();
  expect(product.status).toBe(true);
  product.setStatus("true");
  expect(product.status).toBe(true);
  product.setStatus(`1`);
  expect(product.status).toBe(true);
  product.setStatus(1);
  expect(product.status).toBe(true);
  product.setStatus(`3`);
  expect(product.status).toBe(false);
  product.setStatus(`asd`);
  expect(product.status).toBe(false);
  product.setStatus(`asd3`);
  expect(product.status).toBe(false);
  product.setStatus(`asd3.0`);
  expect(product.status).toBe(false);
});

test('Product.setStock', async () => {
  let product = new Product();
  product.setStock();
  expect(product.stock).toBe(0);
  product.setStock(3);
  expect(product.stock).toBe(3);
  product.setStock(`asd`);
  expect(product.stock).toBe(0);
  product.setStock(`asd4`);
  expect(product.stock).toBe(4);
});

test('Product.setCategory', async () => {
  let product = new Product();
  product.setCategory();
  expect(product.category).toBe(null);
  product.setCategory('asd');
  expect(product.category).toBe('asd');
});

test('Product.setThumbnail', async () => {
  let product = new Product();
  product.setThumbnail();
  expect(product.thumbnail).toBe(null);
  product.setThumbnail('asd');
  expect(product.thumbnail).toBe('asd');
});
test('Product.save', async () => {
    const product = new Product(
      1, 
      'Cart test 1',
      "description",
      'cart-test-1',
      10,
      false,
      10
    );
    expect(product.save()).toBe(true);
    expect(Product.items.length).toBe(1);
    expect(Product.isProduct(Product.items[0])).toBe(true);
    expect(Product.items[0].id).toBe(1);
});
test('Product.findByCode', async () => {
    const product = Product.findByCode('cart-test-1');
    expect(Product.isProduct(product)).toBe(true);
    expect(Product.items[0].code).toBe('cart-test-1');
});
test('Product.delete', async () => {
  /**
   * @type {Product}
   */
    const product = Product.findByCode('cart-test-1');
    expect(Product.isProduct(product)).toBe(true);
    expect(product.delete()).toBe(true);
    expect(product.delete()).toBe(true);
    expect(Product.items.length).toBe(0);
});