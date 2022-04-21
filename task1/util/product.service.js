const fs = require('fs');
const path = require('path');

const ProductService = {
    getProductById: getProductById,
}

function getProductById(id) {
    try {
        const productList = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
        const jsonData = JSON.parse(productList)

        let product = jsonData.find((product => product.sku == id));
        return product;

    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

module.exports = ProductService;