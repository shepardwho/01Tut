const Product = require('../models/product');
//const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products, 
                pageTitle: 'All products', 
                path: '/products',
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title, 
            path: 'products/',
            isAuthenticated: req.session.isAuthenticated
        });
        })
        .catch(err => console.log(err)); 
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                prods: products, 
                pageTitle: 'Shop', 
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', { 
                pageTitle: 'Your cart', 
                path: '/cart',
                products: user.cart.items,
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err));

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findById(prodId)
        .then(product => {
            req.user.addToCart(product);
            res.redirect('/cart');
        })
        .then(result => console.log(result));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user
        .removeFromCart(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({'userId': req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders', 
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => console.log(err));
    
};

exports.postCreateOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {qty: i.qty, product: {...i.productId._doc}};
            });
            const order = new Order({
                email: req.user.email,
                userId: req.user,
                products: products
            });
            order.save(); 
        })
        .then(() => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');     
        })
        .catch(err => console.log(err));
};