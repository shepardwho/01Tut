const mongodb = require('mongodb');
const getDb = require("../util/database").getDb; 

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        if (id) {
            this._id = new mongodb.ObjectId(id);
        }
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;

        if (this._id) {
            //Updating the existing product
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }

        return dbOp.then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
                .find()
                .toArray()
                .then(products => {
                    return products;
                })
                .catch(err => {
                    console.log(err);
                });
    }

    static findByPk(id) {
        const db = getDb();
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(id)})
            .next()
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log(err)
            });
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({_id: new mongodb.ObjectId(id)})
            .then(result => {
                console.log('product deleted');
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;