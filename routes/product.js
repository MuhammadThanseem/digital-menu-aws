var express = require('express');
var router = express.Router();
var productHelper = require('../helper/product-helper');


router.post('/create', async (req, res) => {
    let body = req.body;
    let productResponse = await productHelper.createProduct(body);
    res.json(productResponse);
});

router.post('/list',  async (req, res, next) => {
    let body = req.body;
    let listProduct = await productHelper.getProductData(body);
    res.json(listProduct);
});

router.delete("/delete/:id",  async (req, res) => {
    let product_id = req.params.id
    let body = req.body;
    let deleteProduct = await productHelper.deleteProduct(product_id, body);
    res.json(deleteProduct);

});

router.put("/update/:id",  async (req, res) => {
    let product_id = req.params.id
    let body = req.body;
    let updateProduct = await productHelper.updateProduct(product_id, body);
    res.json(updateProduct);
});

router.get("/getDetails/:id",  async (req, res) => {
    let product_id = req.params.id;
    let productById = await productHelper.getProductDetailsUsingId(product_id);
    res.json(productById);
});
router.get("/getProductByCategory/:id",  async (req, res) => {
    let category_id = req.params.id;
    let productById = await productHelper.getProductUsingCategoryId(category_id);
    res.json(productById);
});

module.exports = router;