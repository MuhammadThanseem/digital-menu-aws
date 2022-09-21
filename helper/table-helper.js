let db = require("../config/dbConfig"),
    ObjectID = require("mongodb").ObjectID,
    dbConfig = require("../config/config.json"),
    _table = {

        /****** 
       * Create Table Data
       * Created By MUHAMMAD THANSEEM C
       * Created On 24-AUG-22
      ******/

        createTable: async (data) => {
            try {

                let newTable = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .insertOne(await _table.arrangeTableForCreation(data));
                if (newTable) {
                    return {
                        isCreated: true,
                        message: "Table Created Successfully",
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
        * Update Table Data
        * Created By MUHAMMAD THANSEEM C
        * Created On 24-AUG-22
       ******/

        updateTable: async (id, data) => {
            try {
                let updateTable = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .updateOne(
                        {
                            _id: ObjectID(id)

                        },
                        await _table.arrangeTableForUpdate(data)
                    );
                if (updateTable) {
                    return {
                        isUpdated: true,
                        message: "Table Successfully Updated",
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
        * Arrange Data For Table Creation
        * Created By MUHAMMAD THANSEEM C
        * Created On 24-AUG-22
       ******/

        arrangeTableForCreation: async (data) => {
            return {
                TABLE_NO: data.table_no,
                TABLE_STATUS: data.table_status,
                CREATED_BY: data.created_by,
                CREATED__AT: new Date(),
                UPDATED_BY: data.updated_by,
                UPDATED_AT: new Date()
            }
        },

        /****** 
        * Arrange Data For Table Updation
        * Created By MUHAMMAD THANSEEM C
        * Created On T24ABLE-AUG-22
       ******/

        arrangeTableForUpdate: async (data) => {
            return {
                $set: {
                    TABLE_NO: data.table_no,
                    TABLE_STATUS: data.table_status,
                    UPDATED_BY: data.updated_by,
                    UPDATED_AT: new Date()
                }
            }
        },

        /****** 
         * List Table data
         * Created By MUHAMMAD THANSEEM C
         * Created On 24-AUG-22
        ******/

        getTableData: async (data) => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .find()
                    .count();
                if (data.pageSize && data.pageNumber) {
                    var skip = Number(data.pageSize) * Number(data.pageNumber - 1);
                    var sort = {};
                    var condition = {};

                    let TableArray = await db
                        .get().collection(dbConfig.TABLE).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    table_no: "$TABLE_NO",
                                    table_status: "$TABLE_STATUS"
                                }
                            }
                        ])
                        .skip(skip)
                        .limit(data.pageSize)
                        .toArray()
                    return { data: TableArray, count: count };
                } else {
                    let TableArray = await db
                        .get().collection(dbConfig.TABLE).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    table_no: "$TABLE_NO",
                                    table_status: "$TABLE_STATUS"
                                }
                            }
                        ])
                        .toArray()
                    return { data: TableArray, count: count };
                }
            } catch (e) {
                console.log(e)
            }
        },

        /****** 
         * Delete Unneccessary Table Data
         * Created By MUHAMMAD THANSEEM C
         * Created On 24-AUG-22
        ******/

        deleteTable: async (id, data) => {
            try {
                let deleteTable = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .deleteOne(
                        { _id: ObjectID(id) });
                if (deleteTable) {
                    return {
                        isDelete: true,
                        message: "Table Successfully Deleted",
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
        * List details of a specific Table using id 
        * Created By MUHAMMAD THANSEEM C
        * Created On 24-AUG-22
       ******/

        getTableDetailsUsingId: async (id) => {
            let getTable = await db
                .get()
                .collection(dbConfig.TABLE)
                .aggregate([
                    {
                        $match: { _id: ObjectID(id) },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            table_no: "$TABLE_NO",
                            table_status: "$TABLE_STATUS"
                        }
                    },
                ])
                .toArray();
            return getTable[0];
        },

        /****** 
                * List Table data
                * Created By MUHAMMAD THANSEEM C
                * Created On 24-AUG-22
               ******/

        getTableData: async (data) => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .find()
                    .count();
                if (data.pageSize && data.pageNumber) {
                    var skip = Number(data.pageSize) * Number(data.pageNumber - 1);
                    var sort = {};
                    var condition = {};

                    let TableArray = await db
                        .get().collection(dbConfig.TABLE).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    table_no: "$TABLE_NO",
                                    table_status: "$TABLE_STATUS"
                                }
                            }
                        ])
                        .skip(skip)
                        .limit(data.pageSize)
                        .toArray()
                    return { data: TableArray, count: count };
                } else {
                    let TableArray = await db
                        .get().collection(dbConfig.TABLE).aggregate([
                            {
                                $project: {
                                    _id: "$_id",
                                    table_no: "$TABLE_NO",
                                    table_status: "$TABLE_STATUS"
                                }
                            }
                        ])
                        .toArray()
                    return { data: TableArray, count: count };
                }
            } catch (e) {
                console.log(e)
            }
        },

        /****** 
         * Delete Unneccessary Table Data
         * Created By MUHAMMAD THANSEEM C
         * Created On 24-AUG-22
        ******/

        deleteTable: async (id, data) => {
            try {
                let deleteTable = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .deleteOne(
                        { _id: ObjectID(id) });
                if (deleteTable) {
                    return {
                        isDelete: true,
                        message: "Table Successfully Deleted",
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
        * List details of a specific Table using id 
        * Created By MUHAMMAD THANSEEM C
        * Created On 24-AUG-22
       ******/

        getTableDetailsUsingId: async (id) => {
            let getTable = await db
                .get()
                .collection(dbConfig.TABLE)
                .aggregate([
                    {
                        $match: { _id: ObjectID(id) },
                    },
                    {
                        $project: {
                            _id: "$_id",
                            table_no: "$TABLE_NO",
                            table_status: "$TABLE_STATUS"
                        }
                    },
                ])
                .toArray();
            return getTable[0];
        },

        /****** 
        * List Active Table data
        * Created By MUHAMMAD THANSEEM C
        * Created On 24-AUG-22
       ******/

        getActiveTableData: async () => {
            try {
                let count = await db
                    .get()
                    .collection(dbConfig.TABLE)
                    .find()
                    .count();
                let TableArray = await db
                    .get().collection(dbConfig.TABLE).aggregate([
                        {
                            $match: { TABLE_STATUS: true },
                        },
                        {
                            $project: {
                                _id: "$_id",
                                table_no: "$TABLE_NO",
                                table_status: "$TABLE_STATUS"
                            }
                        }
                    ])
                    .toArray()
                return { data: TableArray, count: count };

            } catch (e) {
                console.log(e)
            }
        },


    };

module.exports = _table;