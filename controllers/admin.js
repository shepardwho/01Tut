const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //console.log(req.user);
    res.render('admin/edit-product', {
        pageTitle: 'Add product', 
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    
    const product = new Product({
        title: title, 
        price: price, 
        imageUrl: imageUrl, 
        description: description,
        userId: req.user
    });
    product.save()
        .then(() => {
            console.log('Product created');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            //const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product', 
                path: '/admin/edit-product/',
                editing: editMode,
                product: product
            });
        }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    Product.findById(prodId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save();
        })
        .then(result => {
            console.log('Product updated!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            res.redirect('/admin/products/');
        })
        .catch(err => console.log(err));    
};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .populate('userId', 'name')
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products, 
                pageTitle: 'Admin Products', 
                path: '/admin/products'});
        })
        .catch(err => console.log(err));
};