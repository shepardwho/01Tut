const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products, 
            docTitle: 'Shop', 
            path: '/'});
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products, 
            docTitle: 'Shop', 
            path: '/'});
    });
};