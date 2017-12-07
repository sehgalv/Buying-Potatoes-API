const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets all stores from the BP_STORE table in the database
 * @param {*} connection  
 */
module.exports.getStores = function getStores(connection) {
    return connection.execute(
        `SELECT * FROM BP_STORE`, [], {
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
                location: `Get stores`,
                err: any,
            })
        }
    );
};


/**
 * Gets single store from the SP_STORE table in the database based of STORE_ID requested
 * @param {*} connection  
 * @param {*} STORE_ID
 */
module.exports.getStore = function getStore(connection, STORE_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_STORE
        WHERE STORE_ID=:STORE_ID`, [STORE_ID], {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Store with id'${STORE_ID}' does not exist.`,
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
                location: `Get store`,
                err: any,
            })
        }
    );
};

/**
 * Gets all stores from the BP_STORE_OWNER table in the database based of USER_ID requested
 * @param {*} connection  
 * @param {*} USER_ID
 */
module.exports.getStoreOwner = function getStoreOwner(connection, USER_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_STORE_OWNER so left join BP_STORE s
        on so.store_id = s.store_id
        left join BP_USER u
        on so.user_id = u.user_id
        WHERE so.USER_ID=:USER_ID`, [USER_ID], {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Stores with USER_ID'${USER_ID}' do not exist.`,
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
                location: `Get stores owned by user`,
                err: any,
            })
        }
    );
};

//put item in BP_ITEM
//put item in BP_ITEM_IN_STORE
//delete item from store


