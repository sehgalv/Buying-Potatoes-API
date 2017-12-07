const routes = require('../routes');

/**
 * Gets all users from the BP_USERS table in the database
 * @param {*} connection  
 */
module.exports.getUsers = function getUsers(connection) {
    return connection.execute(
        `SELECT * FROM BP_USER`, []
    )
    .then(
        (res) => {
            return Promise.resolve({
                status: 200,
                data: res.rows
            })
        },
        (err) => {
            return Promise.reject({
                location: `Get user`,
                err: any,
            })
        }
    );
};


/**
 * Gets single user from the BP_USER table in the database based of USER_ID requested
 * @param {*} connection  
 * @param {*} USER_ID
 */
module.exports.getUser = function getUser(connection, USER_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_USER
        WHERE USER_ID=:USER_ID`, [USER_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `USER with id'${USER_ID}' does not exist.`,
                    err: any,
                });
            } else {
                return Promise.resolve({
                    status: 200,
                    data: res.rows
                });
            }
        },
        (err) => {
            return Promise.reject({
                location: `Get user`,
                err: any,
            })
        }
    );
};

/**
 * Gets all lists from the BP_USER_LIST table in the database based of USER_ID requested
 * @param {*} connection  
 * @param {*} USER_ID
 */
module.exports.getUserLists = function getUserLists(connection, USER_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_USER_LIST
        WHERE USER_ID=:USER_ID`, [USER_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Lists with USER_ID'${USER_ID}' do not exist.`,
                    err: any,
                });
            } else {
                return Promise.resolve({
                    status: 200,
                    data: res.rows
                });
            }
        },
        (err) => {
            return Promise.reject({
                location: `Get lists related to user`,
                err: any,
            })
        }
    );
};



