const routes = require('../routes');
// const format = routes.format;

/**
 * Gets all items from the BP_ITEMS table in the database
 * @param {*} connection  
 */
module.exports.getItems = function getItems(connection) {
    return connection.execute(
        `SELECT * FROM BP_ITEM`, []
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
                location: `Get items`,
                err: any,
            })
        }
    );
};


/**
 * Gets single item from the BP_ITEM table in the database based of ITEM_ID requested
 * @param {*} connection  
 * @param {*} ITEM_ID
 */
module.exports.getItem = function getItem(connection, ITEM_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ITEM
        WHERE ITEM_ID=:ITEM_ID`, [ITEM_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Item with id'${ITEM_ID}' does not exist.`,
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
                location: `Get item`,
                err: any,
            })
        }
    );
};

/**
 * Gets all items from the BP_ITEM_IN_STORE table in the database based of STORE_ID requested
 * @param {*} connection  
 * @param {*} ITEM_ID
 */
module.exports.getItemsInStore = function getItemsInStore(connection, STORE_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ITEM_IN_STORE
        WHERE STORE_ID=:STORE_ID`, [STORE_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Items with STORE_ID'${STORE_ID}' do not exist.`,
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
                location: `Get items in stores`,
                err: any,
            })
        }
    );
};

/**
 * Gets all items from the BP_ITEM_IN_STORE table in the database based of STORE_ID requested
 * @param {*} connection  
 * @param {*} ITEM_ID
 */
module.exports.getItemInStore = function getItemInStore(connection, ITEM_ID, STORE_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ITEM_IN_STORE
        WHERE STORE_ID=:STORE_ID
        AND ITEM_ID=:ITEM_ID`, [ITEM_ID, STORE_ID]
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Item with ID '${ITEM_ID}' in STORE with ID '${STORE_ID}' does not exist.`,
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
                location: `Get item in stores`,
                err: any,
            })
        }
    );
};

//put item in BP_ITEM
//put item in BP_ITEM_IN_STORE
//delete item from store


