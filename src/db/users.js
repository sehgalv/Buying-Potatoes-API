var oracledb = require('oracledb');

const routes = require('../routes');

/**
 * Gets all users from the BP_USERS table in the database
 * @param {*} connection  
 */
module.exports.getUsers = function getUsers(connection) {
    return connection.execute(
        `SELECT * FROM BP_USER`, [],  {
            outFormat: oracledb.OBJECT
        }
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
        WHERE USER_ID=:USER_ID`, [USER_ID],  {
            outFormat: oracledb.OBJECT
        }
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
        FROM BP_USER_LIST ul left join BP_USER u
        on ul.user_id = u.user_id
        WHERE ul.USER_ID=:USER_ID`, [USER_ID], {
            outFormat: oracledb.OBJECT
        }
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

/**
 * Gets address from the join of BP_USER and BP_ADDRESS table in the database based on USER_ID requested
 * @param {*} connection  
 * @param {*} USER_ID
 */
module.exports.getUserAddress = function getUserAddress(connection, USER_ID) {
    return connection.execute(
        `SELECT *
        FROM BP_USER U RIGHT JOIN BP_ADDRESS AD
        ON U.ADDRESS_ID = AD.ADDRESS_ID
        WHERE USER_ID=:USER_ID`, [USER_ID],  {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Address of user with USER_ID'${USER_ID}'.`,
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

