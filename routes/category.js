var express = require('express');
var fs = require('fs');
var router = express.Router();
var categoryHelper = require('../helper/category-helper');


router.post('/create', async (req, res) => {
    const body = req.body;
    let categoryResponse = await categoryHelper.createCategory(body);
    res.json(categoryResponse);
});

router.post('/list', async (req, res, next) => {
    let body = req.body;
    let listCategory = await categoryHelper.getCategoryData(body);
    res.json(listCategory);
});

router.delete("/delete/:id", async (req, res) => {
    let category_id = req.params.id
    let body = req.body;
    let deleteCategory = await categoryHelper.deleteCategory(category_id, body);
    res.json(deleteCategory);

});


router.put("/update/:id", async (req, res) => {
    let category_id = req.params.id
    let body = req.body;
    let updateCategory = await categoryHelper.updateCategory(category_id, body);
    res.json(updateCategory);
});

router.get("/getDetails/:id", async (req, res) => {

    let category_id = req.params.id;
    let categoryById = await categoryHelper.getCategoryDetailsUsingId(category_id);
    res.json(categoryById);
});

module.exports = router;