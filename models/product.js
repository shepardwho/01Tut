const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const pathToProducts = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {

    fs.readFile(pathToProducts, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
        
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(pathToProducts, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}