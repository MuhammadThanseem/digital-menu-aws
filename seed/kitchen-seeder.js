const { ObjectID } = require('mongodb');
var dbConfig = require('../config/config.json'),
    db = require('../config/dbConfig'),
    crypto = require('crypto'),
    MongoClient = require('mongoose');
var salt = crypto.randomBytes(16).toString('hex');
MongoClient.connect(dbConfig.dbUrl, async (err, db) => {

    console.log('Seeding Kitchen User ......');
    var body = {
        FIRST_NAME: 'kitchen',
        LAST_NAME: 'EL COMIENZO',
        PHONE_NUMBER_1: '9526069529',
        PHONE_NUMBER_2: '9526069529',
        EMAIL: 'kitchen@gmail.com',
        ADDRESS:'',
        USER_STATUS: true,
        DELETE_STATUS:false,
        SALT: salt,
        PASSWORD: generatePassword('kitchen'),
        PRIVILEGE: ObjectID("6149e23dc7f649a0f93a10ab"),
        IS_ADMIN:false,
        iS_KITCHEN:true,
    }
    var userCollection = db.collection(dbConfig.USER);
    if (!userCollection) {
        console.log('Collection is not defined in database')
    }
    let user = await db.collection(dbConfig.USER).findOne({$or: [
            {EMAIL: body.EMAIL},
            {FIRST_NAME: body.FIRST_NAME},
        ]});
    if (user) {
        console.log('Kitchen user already exists')
    } else {
        db.collection(dbConfig.USER).insertOne(body, (err, result) => {
            if (err) {
                console.log('ERROR = > ' + err)
            } else {
                console.log('Kitchen User Seed Successfully Completed')
            }
        })
    }


})

function generatePassword(pas) {
    var password = crypto.pbkdf2Sync(pas, salt, 1000, 64, 'sha512').toString('hex');
    return password;

};
