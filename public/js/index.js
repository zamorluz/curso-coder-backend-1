const socket = io(),
    productForm = document.getElementById('product-form');
const productHtml = (product) => `<ul>
    <li>Title: ${product.title} <button class="product-delete" type="button" data-product_id="${product.id}">delete</button></li>
    <li>description: ${product.description}</li>
    <li>code: ${product.code}</li>
    <li>Price: ${product.price}</li>
    <li>Stock: ${product.stock}</li>
    ${product.thumbnail ? `<li>Thumbnail:<br><img src="${product.thumbnail}" alt="product-image"></li>` : ''}
</ul>`;
if(productForm){
    productForm.addEventListener('submit',(event) => {
        event.preventDefault();
        let data = {};
        productForm.querySelectorAll('input, textarea').forEach(input => {
            data[input.name] = input.value;
        });
        return fetch('api/products',{
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            response = await response.json();
            if(typeof response.errors !== typeof undefined){
                
            }
        }).catch(error => {
            console.error(error);
        })
    })
}
const deleteProduct = (product_id) => fetch(`/api/products/${product_id}`,{method: "delete"});
const deleteEventListeners = () => {
    document.querySelectorAll('.product-delete').forEach(element => {
        element.removeEventListener('click',() => {
            deleteProduct(element.dataset.product_id)
        });
        element.addEventListener('click',() => {
            deleteProduct(element.dataset.product_id)
        });
    })
}
socket.on("product.update", (product) => {
    const productHolder = document.getElementById(`product-${product.id}`);
    if(productHolder){
        productHolder.innerHTML = productHtml(product);
    }else{
        document.getElementById('products-realtime').innerHTML += `<li id="product-${product.id}">
            ${productHtml(product)}
        </li>`;
    }
    deleteEventListeners();
});
socket.on("product.delete", (product) => {
    const productHolder = document.getElementById(`product-${product.id}`);
    productHolder.remove();
});