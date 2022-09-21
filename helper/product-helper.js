let db = require("../config/dbConfig"),
    ObjectID = require("mongodb").ObjectID,
    dbConfig = require("../config/config.json"),

    _product = {

        /****** 
       * Create Product Data
       * Created By MUHAMMAD THANSEEM C
       * Created On 23-AUG-22
      ******/

        createProduct: async (data) => {
            try {

                let newProduct = await db
                    .get()
                    .collection(dbConfig.PRODUCT)
                    .insertOne(await _product.arrangeProductForCreation(data));
                if (newProduct) {
                    return {
                        isCreated: true,
                        message: "Product Created Successfully",
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
        * Update Product Data
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        updateProduct: async (id, data) => {
            try {
                let updateProduct = await db
                    .get()
                    .collection(dbConfig.PRODUCT)
                    .updateOne(
                        {
                            _id: ObjectID(id)

                        },
                        await _product.arrangeProductForUpdate(data)
                    );
                if (updateProduct) {
                    return {
                        isUpdated: true,
                        message: "Product Successfully Updated",
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
        * Arrange Data For Product Creation
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        arrangeProductForCreation: async (data) => {
            if (data.multyVal) {
                return {
                    PRODUCT_NAME: data.product_name,
                    IMAGE: data.image,
                    CATEGORY_ID: ObjectID(data.category_id),
                    QUANTITY_LIST: _product.arrangeQunatityForUpdate(data.quantity_list),
                    PRICE: data.price,
                    MULTIPLE_VALUE: data.multyVal,
                    TYPE: data.type,
                    DETAILS: data.details,
                    SINGLE_QTY:0,
                    CREATED_BY: data.created_by,
                    CREATED__AT: new Date(),
                    UPDATED_BY: data.updated_by,
                    UPDATED_AT: new Date()
                }
            } else {
                return {
                    PRODUCT_NAME: data.product_name,
                    IMAGE: data.image,
                    CATEGORY_ID: ObjectID(data.category_id),
                    PRICE: data.price,
                    MULTIPLE_VALUE: data.multyVal,
                    TYPE: data.type,
                    DETAILS: data.details,
                    SINGLE_QTY:0,
                    CREATED_BY: data.created_by,
                    CREATED__AT: new Date(),
                    UPDATED_BY: data.updated_by,
                    UPDATED_AT: new Date()
                }
            }
        },
        /****** 
                * Arrange Data For Quantity Array Updation
                * Created By MUHAMMAD THANSEEM C
                * Created On 26-AUG-22
               ******/
        arrangeQunatityForUpdate(data) {
            let arrayQuantity = [];
            data.forEach(element => {
                arrayQuantity.push({
                    _id: _product.generateRandomId(),
                    qty_type: element.qty_type,
                    qty_value: Number(element.qty_value),
                    qty:0,
                })
            });
            return arrayQuantity;
        },
        /****** 
                        * Arrange Data For Quantity Array Updation
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
        * Arrange Data For Product Updation
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        arrangeProductForUpdate: async (data) => {
            if (data.multyVal) {
                return {
                    $set: {
                        PRODUCT_NAME: data.product_name,
                        IMAGE: data.image,
                        CATEGORY_ID: ObjectID(data.category_id),
                        QUANTITY_LIST: _product.arrangeQunatityForUpdate(data.quantity_list),
                        PRICE: data.price,
                        MULTIPLE_VALUE: data.multyVal,
                        TYPE: data.type,
                        DETAILS: data.details,
                        UPDATED_BY: data.updated_by,
                        UPDATED_AT: new Date()
                    }
                }
            } else {
                return {
                    $set: {
                        PRODUCT_NAME: data.product_name,
                        IMAGE: data.image,
                        CATEGORY_ID: ObjectID(data.category_id),
                        PRICE: data.price,
                        MULTIPLE_VALUE: data.multyVal,
                        TYPE: data.type,
                        DETAILS: data.details,
                        UPDATED_BY: data.updated_by,
                        UPDATED_AT: new Date()
                    }
                }
            }
        },

        /****** 
         * List Product data
         * Created By MUHAMMAD THANSEEM C
         * Created On 23-AUG-22
        ******/

        getProductData: async (data) => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.PRODUCT)
                    .find()
                    .count();
                if (data.pageSize && data.pageNumber) {
                    var skip = Number(data.pageSize) * Number(data.pageNumber - 1);
                    var sort = {};
                    var condition = {};

                    let ProductArray = await db
                        .get().collection(dbConfig.PRODUCT).aggregate([
                            {
                                $lookup: {
                                    from: dbConfig.CATEGORY,
                                    localField: "CATEGORY_ID",
                                    foreignField: "_id",
                                    as: "category"
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    product_name: "$PRODUCT_NAME",
                                    image: "$IMAGE",
                                    price: "$PRICE",
                                    type: "$TYPE",
                                    details: "$DETAILS",
                                    multiple_value: "$MULTIPLE_VALUE",
                                    category: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                    quantity_list: "$QUANTITY_LIST"
                                }
                            }
                        ])
                        .skip(skip)
                        .limit(data.pageSize)
                        .toArray()
                    return { data: ProductArray, count: count };
                } else {
                    let ProductArray = await db
                        .get().collection(dbConfig.PRODUCT).aggregate([
                            {
                                $lookup: {
                                    from: dbConfig.CATEGORY,
                                    localField: "CATEGORY_ID",
                                    foreignField: "_id",
                                    as: "category"
                                }
                            },
                            {
                                $project: {
                                    _id: "$_id",
                                    product_name: "$PRODUCT_NAME",
                                    image: "$IMAGE",
                                    price: "$PRICE",
                                    type: "$TYPE",
                                    details: "$DETAILS",
                                    multiple_value: "$MULTIPLE_VALUE",
                                    category: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                                    quantity_list: "$QUANTITY_LIST"
                                }
                            }
                        ])
                        .toArray()
                    return { data: ProductArray, count: count };
                }
            } catch (e) {
                console.log(e)
            }
        },

        /****** 
         * Delete Unneccessary Product Data
         * Created By MUHAMMAD THANSEEM C
         * Created On 23-AUG-22
        ******/

        deleteProduct: async (id, data) => {
            try {
                let deleteProduct = await db
                    .get()
                    .collection(dbConfig.PRODUCT)
                    .deleteOne(
                        { _id: ObjectID(id) });
                if (deleteProduct) {
                    return {
                        isDelete: true,
                        message: "Product Successfully Deleted",
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

        /****** 
        * List details of a specific Product using id 
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        getProductDetailsUsingId: async (id) => {
            let getProduct = await db
                .get()
                .collection(dbConfig.PRODUCT)
                .aggregate([
                    {
                        $match: { _id: ObjectID(id) },
                    },
                    {
                        $lookup: {
                            from: dbConfig.CATEGORY,
                            localField: "CATEGORY_ID",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $project: {
                            _id: "$_id",
                            product_name: "$PRODUCT_NAME",
                            image: "$IMAGE",
                            price: "$PRICE",
                            type: "$TYPE",
                            multiple_value: "$MULTIPLE_VALUE",
                            details: "$DETAILS",
                            category: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                            category_id: "$CATEGORY_ID",
                            quantity_list: "$QUANTITY_LIST"
                        },
                    },
                ])
                .toArray();
            return getProduct[0];
        },

        /****** 
                    * List details of Product using category id 
                    * Created By MUHAMMAD THANSEEM C
                    * Created On 28-AUG-22
                   ******/

        getProductUsingCategoryId: async (id) => {
            let count = await db
                .get()
                .collection(dbConfig.PRODUCT)
                .find({
                    CATEGORY_ID: ObjectID(id),
                })
                .count();
            let ProductArray = await db
                .get()
                .collection(dbConfig.PRODUCT)
                .aggregate([
                    {
                        $match: { CATEGORY_ID: ObjectID(id) },
                    },
                    {
                        $lookup: {
                            from: dbConfig.CATEGORY,
                            localField: "CATEGORY_ID",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $project: {
                            _id: "$_id",
                            product_name: "$PRODUCT_NAME",
                            image: "$IMAGE",
                            price: "$PRICE",
                            type: "$TYPE",
                            multiple_value: "$MULTIPLE_VALUE",
                            details: "$DETAILS",
                            single_qty:"$SINGLE_QTY",
                            category: { $arrayElemAt: ['$category.CATEGORY_NAME', 0] },
                            category_id: "$CATEGORY_ID",
                            quantity_list: "$QUANTITY_LIST"
                        },
                    },
                ])
                .toArray();
            return { data: ProductArray, count: count };
        },



    };

module.exports = _product;