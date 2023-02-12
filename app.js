const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('63e8fe57ac89e10f7eb550a4')
        .then(user => {
            req.user = new User(user.name, user.email, user._id, user.cart);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.pageNotFound);

mongoConnect(() => {

    app.listen(3000);
});
