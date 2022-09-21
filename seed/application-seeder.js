var dbConfig = require('../config/config.json'),
    db = require('../config/dbConfig'),
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(dbConfig.dbUrl, async (err, db) => {
        console.log('Seeding Application ......');
        db.collection(dbConfig.APPLICATIONS).findOne({
            $and: [
                {ORGANIZATION_NAME: 'EL COMIENZO'},
            ]
        }).then((resultFind) => {
            if (!resultFind) {
                db.collection(dbConfig.APPLICATIONS).insertOne({
                    _id: ObjectID('6149762b72bc5048b458c920'),
                    LOGIN_DATE: new Date(),
                    ORGANIZATION_NAME: 'EL COMIENZO',
                    APPLICATION_FAV_ICON_URL:'',
                    ORGANIZATION_NICK_NAME:'',
                    ORGANIZATION_LOCATION:'',
                    ORGANIZATION_WEBSITE:'',
                    ORGANIZATION_ADDRESS:'',
                })
                .then((result) => {
                    console.log('Success')
                }).catch((err) => {
                    console.log('ERROR:=>')
                    console.log(err)
                })
            } else {
                console.log('Application already exists');
            }
        }).catch((errFind) => {
            console.log(errFind)
        })
    
    })
