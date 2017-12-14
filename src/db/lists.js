const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets single list of items from the BP_LIST_ITEMS table in the database based of LIST_ID requested
 * @param {*} connection  
 * @param {*} LIST_ID
 */
module.exports.getList = function getList(connection, LIST_ID) {
    return connection.execute(
        `SELECT sl.ITEM_ID, it.ITEM_NAME, it.ITEM_DESCRIPTION, ic.CATEGORY_NAME
        FROM BP_LIST_ITEMS sl left join BP_ITEM it
        on sl.item_Id = it.item_id
        left join BP_ITEM_CATEGORY ic
        on it.ITEM_ID = ic.ITEM_ID
        WHERE sl.LIST_ID=:LIST_ID`, [LIST_ID], {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
                var tempItemIds = [];
                for (var i in res.rows) {
                    var itemIDNameDescr = {
                        ITEM_ID: res.rows[i].ITEM_ID,
                        ITEM_NAME: res.rows[i].ITEM_NAME,
                        ITEM_DESCRIPTION: res.rows[i].ITEM_DESCRIPTION
                    };
                    tempItemIds.push(itemIDNameDescr);
                }
                var itemIds = tempItemIds.reduce(function(a, b){
                    if (a.indexOf(b.ITEM_ID) == -1) {
                        a.push(
                            b.ITEM_ID)
                    }
                    return a;
                }, []);

                var categoriesInItem = [];     
                console.log(itemIds, res.rows);                
                for (var j in itemIds) {
                    var j_categories = [];
                    var j_item_name;              
                    var j_item_description;                                        
                    for (var k in res.rows) {                    
                        if(itemIds[j] === res.rows[k].ITEM_ID) {
                            j_item_name = res.rows[k].ITEM_NAME;
                            j_item_description = res.rows[k].ITEM_DESCRIPTION; 
                            j_categories.push(res.rows[k].CATEGORY_NAME)
                        }
                    }
                    categoriesInItem.push({
                        ITEM_ID: itemIds[j],
                        ITEM_NAME: j_item_name,
                        ITEM_DESCRIPTION: j_item_description,
                        CATEGORIES: j_categories
                    });
                }
                return Promise.resolve({
                    status: 200,
                    data: categoriesInItem
                });
        },
        (err) => {
            return Promise.reject({
                location: `Get list`,
                err: "error",
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
                    err: `Unsuccessful in deleting item to list`
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