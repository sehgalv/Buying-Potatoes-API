const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets all items from the BP_ITEMS table in the database
 * @param {*} connection  
 */
module.exports.getItems = function getItems(connection) {
    return connection.execute(
        `SELECT * FROM BP_ITEM`, [], {
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
        WHERE ITEM_ID=:ITEM_ID`, [ITEM_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {
            if (res.rows.length === 0) {
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
        FROM BP_ITEM_IN_STORE itst LEFT JOIN BP_ITEM it
        on itst.item_id = it.item_id
        LEFT JOIN BP_STORE st
        on itst.store_id = st.store_id
        WHERE itst.STORE_ID=:STORE_ID`, [STORE_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {
            if (res.rows.length === 0) {
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
        FROM BP_ITEM_IN_STORE itst LEFT JOIN BP_ITEM it
        on itst.item_id = it.item_id
        LEFT JOIN BP_STORE st
        on itst.store_id = st.store_id
        WHERE itst.STORE_ID=:STORE_ID
        AND itst.ITEM_ID=:ITEM_ID`, [ITEM_ID, STORE_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {
            if (res.rows.length === 0) {
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

/**
 * post item in BP_ITEM table in the database
 * @param {*} connection 
 * @param {*} ITEM_ID 
 */
exports.postItem = function postItem(connection, item) {
    console.log(item);
    return connection.execute(`
        INSERT INTO BP_ITEM
        VALUES (
            ITEM_ID_SEQ.NEXTVAL,
            :ITEM_NAME,
            :ITEM_DESCRIPTION)`,
        [item.ITEM_NAME,
        item.ITEM_DESCRIPTION
        ], {
            autoCommit: true
        })
        .then(
        (res) => {
            if (res.rowsAffected === 0)
                return Promise.reject({
                    location: `POST item`,
                    err: `Unsuccessful in adding item`
                });
            else {
                console.log(JSON.stringify(res));
                return Promise.resolve({
                    status: 200,
                    data: `Successfully added item`
                });
            }

        },
        (err) => Promise.reject({
            location: `POST item`,
            err: err
        })
        );
};

/**
 * put item in BP_ITEM_IN_STORE table in the database 
 * ... needs to be updated if primary key pair aready exists
 * @param {*} connection 
 * @param {*} ITEM_ID 
 */
exports.putItemInStore = function putItemInStore(connection, ITEM_ID, STORE_ID, item) {
    return connection.execute(
    `merge into BP_ITEM_IN_STORE s
    using (select item_id, store_id, price from BP_ITEM_IN_STORE
            where item_id = :ITEM_ID and store_id = :STORE_ID) p
    on (s.item_id = p.item_id and s.store_id = p.store_id) 
    when matched then update set s.price = :PRICE
    when not matched then insert (item_id, store_id, price) values (:ITEM_ID,:STORE_ID, :PRICE)`, [ITEM_ID, STORE_ID, item.price]
)
.then(
    (res) => {
        if(res.rows.length === 0) {
            return Promise.reject({
                location: `unsuccessful`,
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
            location: `PUT items`,
            err: any,
        })
    }
);
};

function checkItemInStoreDoesntExist(connection, ITEM_ID, STORE_ID) {
    return connection.execute(
        `SELECT *
        FROM BP_ITEM_IN_STORE
        WHERE ITEM_ID = :ITEM_ID
        AND STORE_ID = :STORE_ID`,
        [ITEM_ID, STORE_ID]
    )
        .then(
        (res) => {
            if (res.rows.length !== 0) {
                console.log("price already exist");
                return Promise.reject({
                    location: 'itemInStore check',
                    err: res
                });
            } else {
                console.log("doesn't exist");
                return Promise.resolve({
                    status: 200,
                    data: res
                });
            }
        });
}


//delete item from store (ITEM - STORE PAIR)
/*
    DELETE FROM BP_ITEM_IN_STORE
    WHERE ITEM_ID = :ITEM_ID
    AND STORE_ID = :STORE_ID
*/

module.exports.deleteItemInStore = function deleteItemInStore(connection, ITEM_ID, STORE_ID) {
    return connection.execute(
        `DELETE FROM BP_ITEM_IN_STORE
        WHERE ITEM_ID = :ITEM_ID
        AND STORE_ID = :STORE_ID`, [ITEM_ID, STORE_ID], {
            autoCommit: true
        }
    )
    .then(
        (res) => {
            if(res.rowsAffected === 0)  
                return Promise.reject({
                    location: `DELETE item in store`,
                    err: `Unsuccessful in deleting item in store`
                });
            else
                {
                    return Promise.resolve({
                        status: 200,
                        data: `Successfully removed item in store`
                    });
                }
                
        },
        (err) => Promise.reject({
            location: `DELETE item in store`,
            err: err
        })
    );
};