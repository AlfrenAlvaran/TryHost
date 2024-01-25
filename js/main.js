// List Array

const products = [
    {
        id: 1,
        title: "iPhone 12",
        price: 250,
        image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone13hero-202309?wid=340&hei=264&fmt=p-jpg&qlt=95&.v=1692912410963"
    },
    {
        id:2,
        title:"iPhone 13",
        price: 300,
        image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone13hero-202309?wid=340&hei=264&fmt=p-jpg&qlt=95&.v=1692912410963"
    },
    {
        id: 3,
        title: "iPhone 14",
        price: 400,
        image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone14-202209?wid=340&hei=264&fmt=p-jpg&qlt=95&.v=1693086290654"
    },
    {
        id: 4,
        title: "iPhone 14",
        price: 500,
        image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=340&hei=264&fmt=p-jpg&qlt=95&.v=1693086290312"
    }
]


// element to DOM insert into a variables

const productList = document.querySelector('#productList')
const cartItemsElement = document.getElementById("cartItems")
const cartTotalElement = document.querySelector(".cartTotal")

let cart = JSON.parse(localStorage.getItem("cart")) || []

// Render a product list from array to DOM

// function load () {
    
    
// }
function renderProducts () {
    productList.innerHTML = products.map(
        (product) => `
        <div class="product">
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h2 class="product-title">${product.title}</h2>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <a class="add-to-cart" data-id="${product.id}">Add to Cart</a>
            </div>
        </div>
        `
    )
    .join("")


    const AddToCartButtons = document.querySelectorAll(".add-to-cart")
    for(let i = 0; i < AddToCartButtons.length; i++) {
        const AddToCartButton = AddToCartButtons[i]
        AddToCartButton.addEventListener("click", addToCart)
    }
}

function addToCart(event) {
    const productID = parseInt(event.target.dataset.id)
    const product = products.find((product) => product.id === productID)

    if(product) {
        const existingItem = cart.find((item) => item.id === productID)

        if(existingItem) {
            existingItem.quantity++;
        }else {
            const cartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            }

            cart.push(cartItem)
        }
        
      
        saveToLocalStorage()
        updateCartIcon()
        renderCartItem()
        SubTotal()
    }
}

function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function removeFromCart(event) {
    const prodductID = parseInt(event.target.dataset.id)

    cart=cart.filter(item => item.id !== prodductID)
    saveToLocalStorage()
    renderCartItem()
    SubTotal()
    updateCartIcon()
}
function renderCartItem() {
 
    cart = cart.filter(item => item.quantity > 0)

    cartItemsElement.innerHTML = cart
    .map((item) => 
    `
    <div class="cart-item">
    <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-info">
            <h2 class="cart-item-title">${item.title}</h2>
            <input type="number" 
                    name="" 
                    id="" 
                    min="1" 
                    data-id="${item.id}"
                    value="${item.quantity}"
                    class="cart-item-quantity"
                >
        </div>
    <h2 class="cart-item-price">$${item.price}</h2>
    <button class="remove-from-cart" data-id="${item.id}">remove</button>
    </div>
    `   
    ).join("");
    // const quantityInputs = document.querySelectorAll(".cart-item-quantity");
    // quantityInputs.forEach((input) => {
    //     input.addEventListener("input", (event) => {
    //         const newQuantity = parseInt(event.target.value);
    //         const itemID = parseInt(event.target.dataset.id);

    //         const itemToUpdate = cart.find((item) => item.id === itemID);
    //         if (itemToUpdate) {
    //             if (newQuantity === 0) {
    //                 cart = cart.filter((item) => item.id !== itemID);
                   
    //                 saveToLocalStorage();
                    
    //                 renderCartItem(); 
    //             } else {
    //                 itemToUpdate.quantity = newQuantity;
    //                 saveToLocalStorage();
    //                 SubTotal(); 
    //             }
    //         }
    //     });
    // });

    const removeCartbuttons = document.querySelectorAll(".remove-from-cart")
    for(let i = 0; i < removeCartbuttons.length; i++) {
        const remove = removeCartbuttons[i];
        remove.addEventListener("click", removeFromCart)
    }

    const inputChange = document.querySelectorAll(".cart-item-quantity")
    inputChange.forEach(input => {
        input.addEventListener("change", changeQty)
    })
}
// function changeQty (event) {
//     const prodductID = parseInt(event.target.dataset.id)
//     const qty = parseInt(event.target.value)

//     if(qty > 0) {
//         const item = cart.find(item => item.id === prodductID)
//         if (item) 
//         {
//             item.quantity = qty;
//             saveToLocalStorage()
//             SubTotal()
//             renderCartItem()
//         }
//     }
// }

function changeQty(event) {
    const prodductID = parseInt(event.target.dataset.id);
    const qty = parseInt(event.target.value);

    if (qty >= 0) {
        const item = cart.find((item) => item.id === prodductID);
        if (item) {
            if (qty === 0) {
                cart = cart.filter((item) => item.id !== prodductID);
            } else {
                item.quantity = qty;
            }
            saveToLocalStorage();
            renderCartItem();
            SubTotal();
            updateCartIcon()
        }
    }
}
function load() {
    // renderCartItem()
    // renderProducts()
   
    if (window.location.pathname.includes('cart.html')) {
        renderCartItem();
        SubTotal()
        updateCartIcon()
    } else {
        renderProducts();
        updateCartIcon()
    }

    // renderCartItem();
    // renderProducts()
}
// Load funtion
function SubTotal () {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotalElement.innerHTML = `Total: $${total}`
}
document.addEventListener("DOMContentLoaded", load);
const Icon = document.getElementById("cart-icon");
function updateCartIcon() {
    const subtotal = cart.reduce((sum, item) => sum + item.quantity,0)
    Icon.setAttribute("data-quantity", subtotal)
}
function OnCartChange () {
    updateCartIcon()
}



window.addEventListener("storage", OnCartChange)