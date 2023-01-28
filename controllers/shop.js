const Product = require('../models/product');
//const Cart = require('../models/cart');
//const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products, 
                pageTitle: 'All products', 
                path: '/products'});
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title, 
            path: 'products/'});
        })
        .catch(err => console.log(err)); 
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products, 
                pageTitle: 'Shop', 
                path: '/'});
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', { 
                pageTitle: 'Your cart', 
                path: '/cart',
                products: products});
        })
        .catch(err => console.log(err));

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findByPk(prodId)
        .then(product => {
            req.user.addToCart(product);
            res.redirect('/cart');
        })
        .then(result => console.log(result));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

     req.user
        .removeFromCartById(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders', 
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
    
};

exports.postCreateOrder = (req, res, next) => {
    
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};