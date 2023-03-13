const User = require('../models/user');

exports.getLogin = (req, res, next) => { 
    res.render('auth/login', {
        pageTitle: 'Login', 
        path: '/login',
        isAuthenticated: req.session.isAuthenticated
    });      
};

exports.postLogin = (req, res, next) => {

    User.findById('63ed5c6500e9035bcf552be5')
        .then(user => {
            req.session.user = user;
            req.session.isAuthenticated = true; 
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');      
            });
            // next();
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};