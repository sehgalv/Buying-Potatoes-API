const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets single list of items from the BP_SHOPPING_LIST table in the database based of LIST_ID requested
 * @param {*} connection  
 * @param {*} LIST_ID
 */
module.exports.getList = function getList(connection, LIST_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_LIST_ITEMS sl left join BP_ITEM it
        on sl.item_Id = it.item_id
        WHERE sl.LIST_ID=:LIST_ID`, [LIST_ID], {
            outFormat: oracledb.OBJECT
        }
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


// Given itemID and listID, posts list and item pair
exports.postItemToList = function postItemToList(connection, item){
    return connection.execute(`
    INSERT INTO BP_LIST_ITEMS
    VALUES (:LIST_ID, :ITEM_ID)`,
            [item.LIST_ID,
            item.ITEM_ID
            ], {
                autoCommit : true
            })
    .then(
        (res) => {
            if(res.rowsAffected === 0)  
                return Promise.reject({
                    location: `POST list`,
                    err: `Unsuccessful in adding item to list`
                });
            else
                {
                    return Promise.resolve({
                        status: 200,
                        data: `Successfully added item to list`
                    });
                }
                
        },
        (err) => Promise.reject({
            location: `POST list`,
            err: err
        })
    );
};

// DELETE: ITEM-LIST PAIR FROM SHOPPING_LIST
exports.deleteItemFromList = function deleteItemFromList(connection, item){
    return connection.execute(`
    DELETE FROM BP_LIST_ITEMS
    WHERE LIST_ID = :LIST_ID
    AND ITEM_ID = :ITEM_ID`,
            [item.LIST_ID,
            item.ITEM_ID
            ], {
                autoCommit : true
            })
    .then(
        (res) => {
            if(res.rowsAffected === 0)  
                return Promise.reject({
                    location: `DELETE item from list`,
                    err: `Unsuccessful in adding item to list`
                });
            else
                {
                    return Promise.resolve({
                        status: 200,
                        data: `Successfully removed item from list`
                    });
                }
                
        },
        (err) => Promise.reject({
            location: `DELETE item from list`,
            err: err
        })
    );
};