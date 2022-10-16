const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const pathToCart = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //fetch the previous cart
    
        fs.readFile(pathToCart, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            //Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty++;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(pathToCart, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        if (id) {
            fs.readFile(pathToCart, (err, fileContent) => {
                if (err) { 
                    console.log(err);
                    return;
                }
                const cart = JSON.parse(fileContent);
                const updatedCart = {...cart};
                const product = updatedCart.products.find(prod => prod.id === id);

                if (!product) {
                    return;
                }

                updatedCart.totalPrice -= product.qty * productPrice;
                updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
                
                fs.writeFile(pathToCart, JSON.stringify(updatedCart), (err) => {
                    console.log(err);
                });    
            });
        }  
    }

    static getCart(cb) {
        fs.readFile(pathToCart, (err, fileContent) => {
            if (err) { 
                cb(null);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);  
            }
        });    
    }
};