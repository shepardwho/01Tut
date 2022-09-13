const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {docTitle: 'Add product', 
        path: '/admin/add-product',
        formCSS: true,
        productsCSS: true,
        activeAddProduct: true});
};

exports.postAddProduct = (req, res, next) => {
    const addedProduct = new Product(req.body.title);
    addedProduct.save();
    res.redirect('/');
};

exports.getAdminProducts = (req, res, next) => {
    res.render('admin/products');
};