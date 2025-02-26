const socket = io();
let APP_URL;

const _e = (element, type, handle) => {
    element.removeEventListener(type, handle);
    element.addEventListener(type ,handle);
};

const _store =(key, value = null, ttl = null, encode = true) => {
    const currentDate = new Date(),
        currentTime = currentDate.getTime();
    key = encode ? btoa(key) : key;
    ttl = ttl !== null ? ttl * 1000 : null;
    if (value !== null) {
        const expirationDate = new Date();
        expirationDate.setTime(currentTime + ttl); 
        value = {
            value : value,
            ttl : ttl,
            time: {
                current : {
                    date: currentDate,
                    time: currentTime
                }, 
                expires : ttl !== null ? {
                    time: expirationDate.getTime(),
                    date: expirationDate
                } : null
            }
        };
        value = JSON.stringify(value);
        value = encode ? btoa(value) : value;
        localStorage.setItem(key, value);
    }
    value = localStorage.getItem(key);
    if(value !== null){
        value = encode ? atob(value) : value;
        value = JSON.parse(value);
        const value_expiration_time = value.time.expires !== null ? value.time.expires.time :  null,
            expires    = ttl !== null ? (value.time.current.time + ttl) : value_expiration_time,
            is_expired = expires !== null && expires <= currentTime;
        if(is_expired){
            value = null;
            localStorage.removeItem(key);
        }else{
            value = value.value;
        }
    }
    return value;
}

const _request = (url, method, data) => fetch(url, {
    method, 
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json",
    }
});

const productEditFormHTML = (product) => `
<form class="product-form" id="product-edit-form-${product.id}">
    <input type="hidden" name="id" required value="${product.id}">
    <input type="text" class="w-100 mb-3" name="title" placeholder="Product Name" required value="${product.title}">
    <input type="text" class="w-100 mb-3" name="code" placeholder="Product code" required value="${product.code}">
    <input type="text" class="w-100 mb-3" name="category" placeholder="Product category" required value="${product.category}">
    <input type="number" class="w-100 mb-3" name="price" placeholder="Product Price" required value="${product.price}">
    <input type="number" class="w-100 mb-3" name="stock" placeholder="Product stock" required value="${product.stock}">
    <input type="url" class="w-100 mb-3" name="thumbnail" placeholder="Product thumbnail" value="${product.thumbnail}">
    <textarea name="description" class="w-100 mb-3" placeholder="Description" required> ${product.description}</textarea>
    <button type="submit" class=" w-100 btn btn-primary">Save Product</button>
</form>`;

const productGetFormValues = (form) => {
    let data = {};
    form.querySelectorAll('input, textarea').forEach(input => {
        data[input.name] = input.value;
    });
    return data;
};
const productsGetRequest = (page = 1) => _request(`${APP_URL}/api/products?page=${page}&limit=12`,"GET");

const productsEditList = async () => {
    const holder = document.getElementById('products-list-holder');
    if(!holder){
        return;
    }
    const request = await productsGetRequest(holder.getAttribute('data-page')),
        response = await request.json(),
        payload = response.payload,
        nextPage = payload.nextPage,
        products = payload.docs;
    let html = '';
    products.forEach(product => html += document.getElementById(`product-edit-form-${product.id}`) === null ? productEditFormHTML(product) : '');
    holder.innerHTML += html;
    if(nextPage !== null){
        holder.setAttribute('data-page',nextPage);
    }else{
        if(document.getElementById('products-list-loader') != null){
            document.getElementById('products-list-loader').remove();
        }
        
    }
};

const productUpdate = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = productGetFormValues(form),
        id = data.id || null,
        url = `${APP_URL}/api/products${ id !== null ? `/${ id }` : '' }` ,
        method = id !== null ? "PATCH" : "PUT";
    try
    {
        const response = await _request(url , method , data);
        response = await response.json();
        if ( typeof response.errors !== typeof undefined )
        {
        }
    } catch ( error )
    {
        console.error( error );
    }
}

const productDelete = (event) => fetch(`${APP_URL}/api/products/${event.target.dataset.product_id}`,{method: "delete"});

const productGoToDetail = (event) => {
    const element = event.target;
    window.location.href = `/products/${element.dataset.code}`;
}

const productEventListeners = () => {
    document.querySelectorAll('.product-delete').forEach(element => _e(element,'click',productDelete));
    document.querySelectorAll('.js-product').forEach(element => _e(element,'click',productGoToDetail));
    document.querySelectorAll('.product-form').forEach(form => _e(form,'submit', productUpdate));

    if(document.getElementById('products-list-loader') != null){
        _e(document.getElementById('products-list-loader'),'click',productsEditList)
    }
    
};

const productsInit = () => {
    productEventListeners();
    productsEditList();
}

const cartToggle = () => {
    const opener = document.getElementById('cart-opener'),
        cartWindow = document.getElementById('cart-window');
    if(cartWindow.classList.contains('d-none')){
        cartWindow.classList.remove('d-none');
        opener.classList.add('d-none');
    }else{
        opener.classList.remove('d-none');
        cartWindow.classList.add('d-none');
    }
};
const cartGetRequest = async () => _request(`${APP_URL}/api/carts/${await cartGetID()}`, "GET");

const cartCreateRequest = () => _request(`${APP_URL}/api/carts`, "POST").then(async response => _store('cart-id',(await response.json()).payload._id));

const cartAddRequest = async(product_id, qty) => _request(`${APP_URL}/api/carts/${await cartGetID()}/product/${product_id}`, "POST",{qty});

const cartDeleteRequest = async(product_id) => _request(`${APP_URL}/api/carts/${await cartGetID()}/product/${product_id}`, "DELETE");

const cartGetID = async () => {
    if(_store('cart-id') == null){
        await cartCreateRequest();
    }
    return _store('cart-id');
};

const cartAdd = async (event) => {
    const element = event.target,
        pid = element.dataset.pid,
        col = element.parentElement,
        row = col.parentElement,
        qty = row.querySelector('.js-cart-quantity').value;
    cartAddRequest(pid, qty)
};

const cartAddOne = async (event) => cartAddRequest(event.target.dataset.pid, 1);

const cartDeleteOne = async (event) => cartAddRequest(event.target.dataset.pid, -1);

const cartDeleteAll = async (event) => cartDeleteRequest(event.target.dataset.pid);

const cartEventListeners = () => {
    document.querySelectorAll('.js-cart-toggler').forEach(element => _e(element,'click', cartToggle));
    document.querySelectorAll('.js-cart-add').forEach(element => _e(element, 'click', cartAdd));
    document.querySelectorAll('.js-cart-add-1').forEach(element => _e(element, 'click', cartAddOne));
    document.querySelectorAll('.js-cart-delete-1').forEach(element => _e(element, 'click', cartDeleteOne));
    document.querySelectorAll('.js-cart-delete-item').forEach(element => _e(element, 'click', cartDeleteAll));
};
const cartInit = () => {
    cartEventListeners();
    cartGetRequest();
};

socket.on("product.update", (product) => {
    const productHolder = document.getElementById(`product-${product._id}`),
        productEditForm = document.getElementById(`product-edit-form-${product._id}`);
    document.querySelectorAll(`.js-product-image[data-pid="${product._id}"]`).forEach(element => {
        element.setAttribute('data-code',product.image);
        element.style.backgroundImage = `url(${product.thumbnail})`;
    });
    document.querySelectorAll(`.js-product-title[data-pid="${product._id}"]`).forEach(element => {
        element.setAttribute('data-code',product.title);
        element.innerHTML = product.title;
    });
    document.querySelectorAll(`.js-product-description[data-pid="${product._id}"]`).forEach(element => {
        element.setAttribute('data-code',product.description);
        element.innerHTML = `Description:<br> ${product.description}`;
    })
    document.querySelector(`.js-cart-quantity[data-pid="${product._id}"]`).setAttribute('max',product.stock);
    document.querySelector(`.js-cart-qty[data-pid="${product._id}"]`).forEach(element => {
        element.innerHTML = product.stock;
    });
    
    document.querySelector(`.js-cart-price[data-pid="${product._id}"]`).forEach(element => {
        element.innerHTML = product.price;
    });
    productEventListeners();
    cartEventListeners();
});
const cartWindowItemHtml = (product, qty) => `<div class="js-cart-product m-3 p-3 rounded bg-light text-dark">
    <div class="row">
        <div class="col-4" style="background-image:url(${product.thumbnail}); height:150px;"></div>
        <div class="col-8 text-uppercase">
            <div class="position-relative h-100">
                <h3 class="js-product-title" data-pid="${product._id}">${product.title}</h3>
                <div class="position-absolute bottom-0 start-0 w-100">
                    <div class="row">
                        <div class="col-8">
                            <div class="row">
                                <div class="js-cart-delete-1 col-2 text-center bg-danger text-white" data-pid="${product._id}" role="button">
                                    <div class="js-cart-delete-1 fa-solid fa-minus" data-pid="${product._id}"></div>
                                </div>
                                <div class="col-8 text-center">
                                ${qty}
                                </div>
                                <div class="js-cart-add-1 col-2 text-center bg-success text-white" data-pid="${product._id}" role="button">
                                    <div class="fa-solid fa-plus js-cart-add-1" data-pid="${product._id}"></div>
                                </div>
                            </div>
                        </div>
                        <div class="js-cart-delete-item col-4 bg-danger text-white text-center" data-pid="${product._id}">
                            <div class="fa-solid fa-trash"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
socket.on("cart.update", (products) => {
    let html = '',
        total = 0;
    products.forEach(product => {
        const qty = product.qty;
        product = product.product;
        html += cartWindowItemHtml(product,qty);
        total += qty * product.price;
    });
    html += `<div class="m-3 p-3 bg-dark text-light text-end">
        Total: ${total} USD
    </div>`;
    document.querySelectorAll('.js-cart-items').forEach(element => element.innerHTML = html);
    productEventListeners();
    cartEventListeners();
});
socket.on("product.delete", (product_id) => {
    const productHolder = document.getElementById(`product-${product_id}`);
    productHolder.remove();
});
window.onload = function(){
    APP_URL = document.querySelector('body').dataset.app_url;
    productsInit();
    cartInit();
}