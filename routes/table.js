var express = require('express');
var router = express.Router();
var tableHelper = require('../helper/table-helper');


router.post('/create', async (req, res) => {
    let body = req.body;
    let tableResponse = await tableHelper.createTable(body);
    res.json(tableResponse);
});

router.post('/list',  async (req, res, next) => {
    let body = req.body;
    let listTable = await tableHelper.getTableData(body);
    res.json(listTable);
});

router.delete("/delete/:id",  async (req, res) => {
    let table_id = req.params.id;
    let body = req.body;
    let deleteTable = await tableHelper.deleteTable(table_id, body);
    res.json(deleteTable);

});

router.put("/update/:id",  async (req, res) => {
    let table_id = req.params.id
    let body = req.body;
    let updateTable = await tableHelper.updateTable(table_id, body);
    res.json(updateTable);
});

router.get("/getDetails/:id",  async (req, res) => {
    let table_id = req.params.id;
    let tableById = await tableHelper.getTableDetailsUsingId(table_id);
    res.json(tableById);
});

router.get("/getActiveTable",  async (req, res) => {
    let activeTableData = await tableHelper.getActiveTableData();
    res.json(activeTableData);
});

module.exports = router;