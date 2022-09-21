let db = require("../config/dbConfig"),
    ObjectID = require("mongodb").ObjectID,
    dbConfig = require("../config/config.json"),

    _category = {

        /****** 
       * Create Category Data
       * Created By MUHAMMAD THANSEEM C
       * Created On 23-AUG-22
      ******/

        createCategory: async (data) => {
            try {

                let newCategory = await db
                    .get()
                    .collection(dbConfig.CATEGORY)
                    .insertOne(await _category.arrangeCategoryForCreation(data));
                if (newCategory) {
                    return {
                        isCreated: true,
                        message: "Category Created Successfully",
                        id: newCategory.insertedId
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
        * Update Category Data
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        updateCategory: async (id, data) => {
            try {
                let updateCategory = await db
                    .get()
                    .collection(dbConfig.CATEGORY)
                    .updateOne(
                        {
                            _id: ObjectID(id)

                        },
                        await _category.arrangeCategoryForUpdate(data)
                    );
                if (updateCategory) {
                    return {
                        isUpdated: true,
                        message: "Category Successfully Updated",
                        id:id
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
        * Arrange Data For Category Creation
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        arrangeCategoryForCreation: async (data) => {
            return {
                CATEGORY_NAME: data.category_name,
                IMAGE: data.image,
                CREATED_BY: data.created_by,
                CREATED__AT: new Date(),
                UPDATED_BY: data.updated_by,
                UPDATED_AT: new Date()
            }
        },
        uploadCategoryImage: async (id, body) => {
            console.log('reached to image upload', id);
            return dp = await db.get().collection(dbConfig.CATEGORY).updateOne({ _id: ObjectID(id) }, {
                $set: {
                    IMAGE: 'category' + '/' + '_category' + id + '.jpeg'
                }
            })
        },
        /****** 
        * Arrange Data For Category Updation
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        arrangeCategoryForUpdate: async (data) => {
            return {
                $set: {
                    CATEGORY_NAME: data.category_name,
                    IMAGE: data.image,
                    UPDATED_BY: data.updated_by,
                    UPDATED_AT: new Date()
                }
            }
        },

        /****** 
         * List Category data
         * Created By MUHAMMAD THANSEEM C
         * Created On 23-AUG-22
        ******/

        getCategoryData: async (data) => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.CATEGORY)
                    .find()
                    .count();
                if (data.pageSize && data.pageNumber) {
                    var skip = Number(data.pageSize) * Number(data.pageNumber - 1);
                    var sort = {};
                    var condition = {};
                    let CategoryArray = await db
                        .get().collection(dbConfig.CATEGORY).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    category_name: "$CATEGORY_NAME",
                                    image: "$IMAGE"
                                }
                            }
                        ])
                        .skip(skip)
                        .limit(data.pageSize)
                        .toArray()
                    return { data: CategoryArray, count: count };
                } else {
                    let CategoryArray = await db
                        .get().collection(dbConfig.CATEGORY).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    category_name: "$CATEGORY_NAME",
                                    image: "$IMAGE"
                                }
                            }
                        ])
                        .toArray()
                    return { data: CategoryArray, count: count };
                }


            } catch (e) {
                console.log(e)
            }
        },

        /****** 
         * Delete Unneccessary Category Data
         * Created By MUHAMMAD THANSEEM C
         * Created On 23-AUG-22
        ******/

        deleteCategory: async (id, data) => {
            try {
                let deleteCategory = await db
                    .get()
                    .collection(dbConfig.CATEGORY)
                    .deleteOne(
                        { _id: ObjectID(id) });
                if (deleteCategory) {
                    return {
                        isDelete: true,
                        message: "Category Successfully Deleted",
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
        * List details of a specific Category using id 
        * Created By MUHAMMAD THANSEEM C
        * Created On 23-AUG-22
       ******/

        getCategoryDetailsUsingId: async (id) => {
            let getCategory = await db
                .get()
                .collection(dbConfig.CATEGORY)
                .aggregate([
                    {
                        $match: { _id: ObjectID(id) },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            category_name: "$CATEGORY_NAME",
                            image: "$IMAGE"
                        },
                    },
                ])
                .toArray();
            return getCategory[0];
        },




    };

module.exports = _category;