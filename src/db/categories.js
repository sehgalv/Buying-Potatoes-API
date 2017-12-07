const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets all categories from the BP_CATEGORY table in the database
 * @param {*} connection  
 */
module.exports.getCategories = function getCategories(connection) {
    return connection.execute(
        `SELECT * FROM BP_CATEGORY`, [], {
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
                location: `Get categories`,
                err: any,
            })
        }
    );
};


/**
 * Gets all categories from the BP_ITEM_CATEGORY table in the database based of ITEM_ID requested
 * @param {*} connection  
 * @param {*} ITEM_ID
 */
module.exports.getItemCategories = function getItemCategories(connection, ITEM_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ITEM_CATEGORY
        WHERE ITEM_ID=:ITEM_ID`, [ITEM_ID], {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Item_id'${ITEM_ID}' does not have any associated categories.`,
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
                location: `Get categories`,
                err: any,
            })
        }
    );
};