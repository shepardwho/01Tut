const mongodb = require('mongodb');
const getDb = require("../util/database").getDb; 

class User {
    constructor(username, email, id, cart) {
        this.name = username;
        this.email = email;
        if (id) {
            this._id = new mongodb.ObjectId(id);
        }
        this.cart = cart; //{items: []}
    }

    save() {
        db = getDb();
        let dbOp;

        if (this._id) {
            dbop = db.collection('users').insertOne(this);
        } else {
            dbop = db.collection('users').updateOne({_id: this._id}, {$set: this});   
        }
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].qty + 1;
            updatedCartItems[cartProductIndex].qty = newQuantity;
        } else {
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), qty: newQuantity});
        }
        
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        db.collection('users')
            .updateOne(
                {_id: this._id}, 
                {$set: {cart: updatedCart}}
            );
    }

    removeFromCartById(productId) {
        const updatedCartItems = this.cart.items.filter(item => 
            item.productId.toString() != productId
        );

        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users')
            .updateOne(
                {_id: this._id}, 
                {$set: {cart: updatedCart}}
            );  
    }

    getCart() {
        const db = getDb();
        const productIDs = this.cart.items.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({_id: {$in: productIDs}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p, 
                        qty: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).qty
                    };
                });
            });
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: this._id,
                    name: this.name
                }
            };
            return db.collection('orders')
                .insertOne(order);
        })
        .then(result => {
                this.cart = {items: []};
                return db.collection('users')
                    .updateOne(
                        {_id: this._id}, 
                        {$set: {cart: this.cart}}
                    );
            })
            .catch(err => console.log(err));
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new mongodb.ObjectId(id)})
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log(err)
            });
    }
}

module.exports = User;