let db = require("../config/dbConfig"),
    ObjectID = require("mongodb").ObjectID,
    dbConfig = require("../config/config.json"),
    _cart = require('../helper/cart-helper')
_order = {

    /****** 
   * Create Order Data
   * Created By MUHAMMAD THANSEEM C
   * Created On 23-AUG-22
  ******/

    createOrder: async (data) => {
        try {
            getOrderData = await db
                .get()
                .collection(dbConfig.CART)
                .find({
                    $and: [{ _id: ObjectID(data.cartId) }],
                }).toArray();
            let newOrder = await db
                .get()
                .collection(dbConfig.ORDER)
                .insertOne(await _order.arrangeOrderForCreation(getOrderData[0]));
            if (newOrder) {
                let deleteCart = _cart.deleteCart(getOrderData[0]._id)
                if (deleteCart) {
                    return {
                        isCreated: true,
                        message: "Order Created Successfully",
                        id: newOrder.insertedId
                    };
                }
            } else {
                return {
                    isCreated: false,
                    message: "No Privilege To Access",
                };
            }
        } catch (e) {
            return { isCreated: false, message: e.message };
        }
    },

    updateOrder: async (id, data) => {
        try {
            let updateOrder = await db
                .get()
                .collection(dbConfig.ORDER)
                .updateOne(
                    {
                        _id: ObjectID(id)

                    },
                    await _order.arrangeOrderForUpdate(data)
                );
            if (updateOrder) {
                return {
                    isUpdated: true,
                    message: "Order Successfully Updated",
                    id: id
                };
            } else {

                return {
                    isUpdated: false,
                    message: "Internal Server Error Please Try After Some Time",
                };
            }

        } catch (e) {
            return { isUpdated: false, message: e.message };
        }
    },

    arrangeOrderForCreation: async (data) => {
        return {
            TABLE_NO: ObjectID(data.TABLE_NO),
            TOTAL_CART_PRICE: data.TOTAL_CART_PRICE,
            PRODUCT_LIST: data.PRODUCT_LIST,
            CREATED__AT: new Date(),
            UPDATED_AT: new Date(),
            STATUS: "Start"
        }
    },
    arrangeOrderForUpdate: async (data) => {
        return {
            $set: {
                STATUS: data.status,
            }
        }
    },
    /****** 
     * List Order data
     * Created By MUHAMMAD THANSEEM C
     * Created On 23-AUG-22
    ******/

    getOrderData: async (data) => {
        try {
            let id = data.table_id;
            if (id) {
                let OrderArray = await db
                    .get().collection(dbConfig.ORDER).aggregate([
                        // {
                        //     $match: { TABLE_NO: ObjectID(id) },
                        // },
                        {
                            $unwind: "$PRODUCT_LIST"
                        },
                        {
                            $lookup: {
                                from: dbConfig.CATEGORY,
                                localField: "PRODUCT_LIST.CATEGORY_ID",
                                foreignField: "_id",
                                as: "category"
                            },
                        },
                        {
                            $lookup: {
                                from: dbConfig.PRODUCT,
                                localField: "PRODUCT_LIST.PRODUCT_ID",
                                foreignField: "_id",
                                as: "product"
                            }
                        },
                        {
                            $lookup: {
                                from: dbConfig.TABLE,
                                localField: "TABLE_NO",
                                foreignField: "_id",
                                as: "table"
                            }
                        },
                        {

                            $group: {
                                _id: "$TABLE_NO",
                                total_cart_price: { "$first": "$TOTAL_CART_PRICE" },
                                quantity: {
                                    $push: {
                                        _id: "$PRODUCT_LIST._id",
                                        category_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                        product_name: { $arrayElemAt: ['$product.PRODUCT_NAME', 0] },
                                        product_type: { $arrayElemAt: ['$product.TYPE', 0] },
                                        description: { $arrayElemAt: ['$product.DETAILS', 0] },
                                        quantity: "$PRODUCT_LIST.QUANTITY",
                                        price: "$PRODUCT_LIST.PRICE",
                                        total_quantity_price: "$PRODUCT_LIST.TOTAL_QUANTITY_PRICE",
                                        quantity_type: "$PRODUCT_LIST.QUANTITY_TYPE",
                                    }
                                },
                                table_id: { "$first": "$TABLE_NO" },
                                order_id: { "$first": "$_id" },
                                table: { $first: { $arrayElemAt: ['$table.TABLE_NO', 0] } },
                                status: { "$first": "$STATUS" }

                            }
                        }
                    ]).toArray()
                return { data: OrderArray };

            } else {
                let OrderArray = await db
                    .get().collection(dbConfig.ORDER).aggregate([

                        {
                            $unwind: "$PRODUCT_LIST"
                        },
                        {
                            $lookup: {
                                from: dbConfig.CATEGORY,
                                localField: "PRODUCT_LIST.CATEGORY_ID",
                                foreignField: "_id",
                                as: "category"
                            },
                        },
                        {
                            $lookup: {
                                from: dbConfig.PRODUCT,
                                localField: "PRODUCT_LIST.PRODUCT_ID",
                                foreignField: "_id",
                                as: "product"
                            }
                        },
                        {
                            $lookup: {
                                from: dbConfig.TABLE,
                                localField: "TABLE_NO",
                                foreignField: "_id",
                                as: "table"
                            }
                        },
                        {
                            $group: {
                                _id: "$TABLE_NO",
                                total_cart_price: { "$first": "$TOTAL_CART_PRICE" },
                                quantity: {
                                    $push: {
                                        _id: "$PRODUCT_LIST._id",
                                        category_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                        product_name: { $arrayElemAt: ['$product.PRODUCT_NAME', 0] },
                                        product_type: { $arrayElemAt: ['$product.TYPE', 0] },
                                        description: { $arrayElemAt: ['$product.DETAILS', 0] },
                                        quantity: "$PRODUCT_LIST.QUANTITY",
                                        price: "$PRODUCT_LIST.PRICE",
                                        total_quantity_price: "$PRODUCT_LIST.TOTAL_QUANTITY_PRICE",
                                        quantity_type: "$PRODUCT_LIST.QUANTITY_TYPE",
                                    }
                                },
                                table_id: { "$first": "$TABLE_NO" },
                                order_id: { "$first": "$_id" },
                                table: { $first: { $arrayElemAt: ['$table.TABLE_NO', 0] } },
                                status: { "$first": "$STATUS" }

                            }
                        }
                    ])
                    .sort({ created_at: -1 })
                    .toArray()
                return { data: OrderArray };
            }
        } catch (e) {
            console.log(e)
        }
    },

    /****** 
     * Delete Unneccessary Order Data
     * Created By MUHAMMAD THANSEEM C
     * Created On 23-AUG-22
    ******/

    deleteOrder: async (id) => {
        try {
            let deleteOrder = await db
                .get()
                .collection(dbConfig.ORDER)
                .deleteOne(
                    { _id: ObjectID(id) });
            if (deleteOrder) {
                return {
                    isDelete: true,
                    message: "Order Successfully Deleted",
                };

            } else {
                return {
                    isCreated: false,
                    message: "No Privilege To Access",
                };
            }
        } catch (e) {
            return { isDelete: false, message: e.message };
        }
    },



};

module.exports = _order;