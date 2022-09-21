let db = require("../config/dbConfig"),
    dbConfig = require("../config/config.json"),
    crypto = require('crypto'),
    jwt = require("jsonwebtoken"),

    _login = {

        /****** 
       * Create Login
       * Created By MUHAMMAD THANSEEM C
       * Created On 25-AUG-22
      ******/

        login: async (data) => {
            try {
                // Get user input
                console.log('Data Reacged to Helper *****', data);
                const { email, password } = data.formData;

                // Validate if user exist in our database
                let user = await db
                    .get()
                    .collection(dbConfig.USER)
                    .findOne({
                        EMAIL: email,
                    });
                // console.log('111', user);
                if (user && (await _login.verifyPassword(user.PASSWORD, password, user.SALT))) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        "digitalmenu",
                        {
                            expiresIn: "2h",
                        }
                    );

                    // save user token
                    user.token = token;

                    // user
                    return {
                        isAuthenticate: true,
                        user: user,
                        message: "Login Success"
                    };
                }
                return {
                    isAuthenticate: false,
                    message: "Invalid Credentials"
                };
            } catch (err) {
                console.log(err);
                return {
                    isAuthenticate: false,
                    message: "Catch Error" + err
                };
            }
        },
        verifyPassword: async (dbPassword, inputPassword, salt) => {

            if (dbPassword == crypto.pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha512').toString('hex')) {
                return true;
            } else {
                return false;
            }
        },
    };

module.exports = _login;