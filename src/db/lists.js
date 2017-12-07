const routes = require('../routes');

/**
 * Gets all lists from the BP_USERS table in the database
 * @param {*} connection  
 */
module.exports.getLists = function getLists(connection) {
    return connection.execute(
        `SELECT * FROM BP_SHOPPING_LIST`, []
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
                location: `Get lists`,
                err: any,
            })
        }
    );
};


/**
 * Gets single list of items from the BP_SHOPPING_LIST table in the database based of LIST_ID requested
 * @param {*} connection  
 * @param {*} LIST_ID
 */
module.exports.getList = function getList(connection, LIST_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_SHOPPING_LIST
        WHERE LIST_ID=:LIST_ID`, [LIST_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `LIST with id'${LIST_ID}' does not have any items.`,
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
                location: `Get list`,
                err: any,
            })
        }
    );
};
