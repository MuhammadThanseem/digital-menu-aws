let db = require("../config/dbConfig"),
    ObjectID = require("mongodb").ObjectID,
    dbConfig = require("../config/config.json"),

    _cart = {

        /****** 
       * Create Cart Data
       * Created By MUHAMMAD THANSEEM C
       * Created On 27-AUG-22
      ******/

        addToCart: async (data) => {
            try {

                let newCart = await db
                    .get()
                    .collection(dbConfig.CART)
                    .insertOne(await _cart.arrangeCartForCreation(data));
                if (newCart) {
                    return {
                        isCreated: true,
                        message: "Cart Created Successfully",
                        id: newCart.insertedId
                    };

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

        /******
        * Update Cart Data
        * Created By MUHAMMAD THANSEEM C
        * Created On 27-AUG-22
       ******/

        updateCart: async (id, data) => {
            let updateCart
            try {
                let getCart = await db
                    .get()
                    .collection(dbConfig.CART)
                    .findOne(
                        { _id: ObjectID(id) },

                    );
                if (getCart.PRODUCT_LIST) {
                    let updateData = await _cart.arrangeUpdateProductList(getCart.PRODUCT_LIST, data)
                    let updateSchema = _cart.priceCalculate(updateData)
                    updateCart = await db
                        .get()
                        .collection(dbConfig.CART)
                        .updateOne(
                            { _id: ObjectID(id) }, {
                            $set: {
                                PRODUCT_LIST: updateData,
                                TOTAL_CART_PRICE: updateSchema
                            }
                        }
                        );
                } else {
                    updateCart = await db
                        .get()
                        .collection(dbConfig.CART)
                        .updateOne(
                            { _id: ObjectID(id) },
                            _cart.arrangeCartForUpdate(data)
                        );
                }
                if (updateCart.modifiedCount != 0) {
                    return {
                        isUpdated: true,
                        message: "Cart Successfully Updated",
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

        /****** 
        * Arrange Data For Cart Creation
        * Created By MUHAMMAD THANSEEM C
        * Created On 27-AUG-22
       ******/

        arrangeCartForCreation: async (data) => {
            return {
                TABLE_NO: ObjectID(data.table_id),
                TOTAL_CART_PRICE: 0,
                CREATED_BY: data.created_by,
                CREATED__AT: new Date(),
                UPDATED_BY: data.updated_by,
                UPDATED_AT: new Date()
            }
        },


        /****** 
       * Arrange Data For Cart Updation
       * Created By MUHAMMAD THANSEEM C
       * Created On 27-AUG-22
      ******/

        arrangeCartForUpdate: (data) => {

            return {
                $set: {
                    PRODUCT_LIST: _cart.arrangeProductForCart(data),
                    TOTAL_CART_PRICE: _cart.totalPriceCalculate(data),
                    UPDATED_BY: data.updated_by,
                    UPDATED_AT: new Date()
                }
            }

        },

        async arrangeUpdateProductList(productList, data) {
            let returnData = _cart.arrangeProductForCart(data)
            return productList.concat(returnData);

        },
        priceCalculate(data) {
            let price = 0;
            data.forEach(element => {
                price = Number(price) + Number(element.TOTAL_QUANTITY_PRICE)
            });
            return price;
        },
        totalPriceCalculate(data) {
            if (!data.multiple_value) {
                let total = Number(data.single_qty) * Number(data.price)
                return total
            } else {
                return _cart.totalPriceCalculation(data.quantity_list)
            }
        },
        /****** 
                        * Arrange Data For Product Array Updation
                        * Created By MUHAMMAD THANSEEM C
                        * Created On 2-AUG-22
                       ******/
        arrangeProductForCart(data) {
            let arrayProduct = [];
            if (!data.multiple_value) {
                let total = Number(data.single_qty) * Number(data.price)
                arrayProduct.push({
                    _id: _cart.generateRandomId(),
                    PRODUCT_ID: ObjectID(data.product_id),
                    CATEGORY_ID: ObjectID(data.category_id),
                    QUANTITY: data.single_qty,
                    PRICE: data.price,
                    TOTAL_QUANTITY_PRICE: total,
                    QUANTITY_TYPE: data.multiple_value
                })
            } else {
                arrayProduct.push({
                    _id: _cart.generateRandomId(),
                    PRODUCT_ID: ObjectID(data.product_id),
                    CATEGORY_ID: ObjectID(data.category_id),
                    QUANTITY: _cart.arrangeQuantityList(data.quantity_list),
                    TOTAL_QUANTITY_PRICE: _cart.totalPriceCalculation(data.quantity_list),
                    QUANTITY_TYPE: data.multiple_value
                })
            }
            return arrayProduct;
        },
        arrangeQuantityList(qunatity) {
            let quantityArray = []
            qunatity.forEach(element => {
                let total = Number(element.qty) * Number(element.qty_value);
                quantityArray.push({
                    qty: element.qty,
                    qty_type: element.qty_type,
                    qty_value: element.qty_value,
                    total: total
                })
            });
            return quantityArray
        },
        totalPriceCalculation(quantity) {
            let total_cart_price = 0;
            quantity.forEach(element => {
                let total = Number(element.qty) * Number(element.qty_value);
                total_cart_price += total;
            });
            return total_cart_price;
        },
        /****** 
                               * Generate random number for ID
                               * Created By MUHAMMAD THANSEEM C
                               * Created On 26-AUG-22
                              ******/
        generateRandomId() {
            var result = '';
            let length = 15
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },



        /****** 
         * List Cart data
         * Created By MUHAMMAD THANSEEM C
         * Created On 27-AUG-22
        ******/

        getCartData: async (data) => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.CART)
                    .find()
                    .count();
                if (data.pageSize && data.pageNumber) {
                    var skip = Number(data.pageSize) * Number(data.pageNumber - 1);
                    var sort = {};
                    var condition = {};
                    let CartArray = await db
                        .get().collection(dbConfig.CART).aggregate([
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
                                $lookup: {
                                    from: dbConfig.PRODUCT,
                                    localField: "PRODUCT_LIST.PRODUCT_ID",
                                    foreignField: "_id",
                                    as: "product"
                                }
                            },
                            {

                                $project: {
                                    _id: "$_id",
                                    category: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                    product_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                    image: { $arrayElemAt: ['$product.IMAGE', 0] },
                                    description: { $arrayElemAt: ['$product.DETAILS', 0] },
                                    quantity: "$PRODUCT_LIST",
                                    total_cart_price: "$TOTAL_CART_PRICE",
                                }
                            }
                        ])
                        .skip(skip)
                        .limit(data.pageSize)
                        .toArray()

                    return { data: CartArray, count: count };

                } else {
                    let CartArray = await db
                        .get().collection(dbConfig.CART).aggregate([
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

                                $project: {
                                    _id: "$_id",
                                    category_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                    product_name: { $arrayElemAt: ['$product.PRODUCT_NAME', 0] },
                                    image: { $arrayElemAt: ['$product.IMAGE', 0] },
                                    description: { $arrayElemAt: ['$product.DETAILS', 0] },
                                    quantity_list: "$PRODUCT_LIST",
                                    total_cart_price: "$TOTAL_CART_PRICE",
                                }
                            }
                        ])
                        .toArray()
                    return { data: CartArray, count: count };
                }


            } catch (e) {
                console.log(e)
            }
        },

        /****** 
         * Delete Unneccessary Cart Data
         * Created By MUHAMMAD THANSEEM C
         * Created On 27-AUG-22
        ******/

        removeFromCart: async (id, data) => {
            try {
                let updateCart = await db
                    .get()
                    .collection(dbConfig.CART)
                    .updateOne(
                        { _id: ObjectID(id) },
                        {
                            $pull: {
                                PRODUCT_LIST: { _id: data.quantity_list._id }
                            }
                        }
                    );
                if (updateCart.modifiedCount != 0) {
                    let deleteCart = await db
                        .get()
                        .collection(dbConfig.CART)
                        .findOne(
                            { _id: ObjectID(id) });
                    let total = _cart.removePriceCalculate(deleteCart.PRODUCT_LIST);
                    let updateNewCart = await db
                        .get()
                        .collection(dbConfig.CART)
                        .updateOne(
                            { _id: ObjectID(id) },
                            {
                                $set: {
                                    TOTAL_CART_PRICE: total
                                }
                            }
                        );
                    if (updateNewCart.modifiedCount != 0) {
                        return {
                            isUpdated: true,
                            message: "Item Removed",
                        };
                    } else {
                        return {
                            isUpdated: false,
                            message: "Internal Server Error Please Try After Some Time",
                        };
                    }
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
        removePriceCalculate: (data) => {
            let price = 0;
            data.forEach(element => {
                price = Number(price) + Number(element.TOTAL_QUANTITY_PRICE)
            });
            return price;

        },
        /****** 
        * List details of a specific Cart using id 
        * Created By MUHAMMAD THANSEEM C
        * Created On 27-AUG-22
       ******/

        getCartDetailsUsingId: async (id) => {
            let getCart = await db
                .get()
                .collection(dbConfig.CART)
                .aggregate([
                    {
                        $match: { _id: ObjectID(id) },
                    },
                    {
                        $unwind: "$PRODUCT"
                    },
                    {
                        $lookup: {
                            from: dbConfig.CATEGORY,
                            localField: "PRODUCT.CATEGORY_ID",
                            foreignField: "_id",
                            as: "category"
                        },
                    },
                    {
                        $lookup: {
                            from: dbConfig.PRODUCT,
                            localField: "PRODUCT.PRODUCT_ID",
                            foreignField: "_id",
                            as: "product"
                        }
                    },
                    {

                        $project: {
                            _id: "$_id",
                            category_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                            product_name: { $arrayElemAt: ['$product.PRODUCT_NAME', 0] },
                            quantity: "$PRODUCT.QUANTITY",
                            price: "$PRODUCT.TOTAL_PRICE"
                        }
                    }
                ])
                .toArray();
            return getCart[0];
        },

        getCartCount: async (id) => {
            let getCart = await db
                .get()
                .collection(dbConfig.CART)
                .aggregate([
                    {
                        $match: { TABLE_NO: ObjectID(id) },
                    },
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

                        $project: {
                            _id: "$_id",
                            category_name: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                            product_name: { $arrayElemAt: ['$product.PRODUCT_NAME', 0] },
                            // image: { $arrayElemAt: ['$product.IMAGE', 0] },
                            quantity_list: "$PRODUCT_LIST",
                            total_cart_price: "$TOTAL_CART_PRICE",

                        }
                    }
                ])
                .toArray();
            let count = getCart.length;
            return count
        },
        /****** 
         * Delete Cart After order placed
         * Created By MUHAMMAD THANSEEM C
         * Created On 23-AUG-22
        ******/

        deleteCart: async (id) => {
            try {
                let deleteCart = await db
                    .get()
                    .collection(dbConfig.CART)
                    .update({ _id: ObjectID(id) }, { $unset: { "PRODUCT_LIST": 1, "TOTAL_CART_PRICE": 1 }, })
                if (deleteCart) {
                    return {
                        isDelete: true,
                        message: "Cart Successfully Deleted",
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

module.exports = _cart;