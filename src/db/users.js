var oracledb = require('oracledb');

const routes = require('../routes');

/**
 * Gets all users from the BP_USERS table in the database
 * @param {*} connection  
 */
module.exports.getUsers = function getUsers(connection) {
    return connection.execute(
        `SELECT * FROM BP_USER`, [], {
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
        WHERE USER_ID=:USER_ID`, [USER_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {
            if (res.rows.length === 0) {
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
        `SELECT ul.LIST_ID, sl.LIST_NAME, i.item_id, i.item_name, i.item_description, ic.category_name
        FROM BP_USER_LIST ul 
        left join BP_LIST_ITEMS li on ul.list_id = li.list_id 
        left join BP_ITEM i on i.item_id = li.item_id
        left join BP_ITEM_CATEGORY ic on ic.item_id = li.item_id
        left join BP_SHOPPING_LIST sl on sl.list_id = ul.list_id
        WHERE ul.USER_ID=:USER_ID`, [USER_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {

            var tempListIDs = [];
            for (var i in res.rows) {
                var listIDName = {
                    list_id: res.rows[i].LIST_ID,
                    list_name: res.rows[i].list_name
                };
                tempListIDs.push(listIDName);
            }
            var listIDs = tempListIDs.reduce(function (a, b) {
                if (a.indexOf(b.list_id) == -1) {
                    a.push(
                        b.list_id)
                }
                return a;
            }, []);
            var itemsInList = [];
            for (var j in listIDs) {
                var j_list_name;
                var l_items = [];
                for (var k in res.rows) {
                    if (listIDs[j] === res.rows[k].LIST_ID) {
                        j_list_name = res.rows[k].LIST_NAME;
                        l_items.push({
                            item_id: res.rows[k].ITEM_ID,
                            item_name: res.rows[k].ITEM_NAME,
                            item_desc: res.rows[k].ITEM_DESCRIPTION,
                        })
                    }
                }

                var tempItemIds = [];
                for (var m in l_items) {
                    var itemIDNameDescr = {
                        ITEM_ID: l_items[m].item_id,
                        ITEM_NAME: l_items[m].item_name,
                        ITEM_DESCRIPTION: l_items[m].item_desc
                    };
                    tempItemIds.push(itemIDNameDescr);
                }
                var itemIds = tempItemIds.reduce(function (a, b) {
                    if (a.indexOf(b.ITEM_ID) == -1) {
                        a.push(
                            b.ITEM_ID)
                    }
                    return a;
                }, []);

                var categoriesInItem = [];
                for (var l in itemIds) {
                    var j_categories = [];
                    var j_item_name;
                    var j_item_description;
                    for (var k in res.rows) {

                        if (itemIds[l] === res.rows[k].ITEM_ID) {
                            j_item_name = res.rows[k].ITEM_NAME;
                            j_item_description = res.rows[k].ITEM_DESCRIPTION;
                            j_categories.push(res.rows[k].CATEGORY_NAME)
                        }
                    }
                    categoriesInItem.push({
                        ITEM_ID: itemIds[l],
                        ITEM_NAME: j_item_name,
                        ITEM_DESCRIPTION: j_item_description,
                        CATEGORIES: j_categories
                    });
                }

                itemsInList.push({
                    list_id: listIDs[j],
                    list_name: j_list_name,
                    items: categoriesInItem
                });
            }
            return Promise.resolve({
                status: 200,
                data: itemsInList
            });
        },
        (err) => {
            return Promise.reject({
                location: `Get lists related to user`,
                err: err,
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
        WHERE USER_ID=:USER_ID`, [USER_ID], {
            outFormat: oracledb.OBJECT
        }
    )
        .then(
        (res) => {
            if (res.rows.length === 0) {
                return Promise.reject({
                    location: `Address of user with USER_ID'${USER_ID}'.`,
                    err: "Address",
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


// ADD USER... if exists, update information
/*
INSERT INTO BP_USER
VALUES (SEQ, :user_first_name, :user_last_name, :user_email, :address_id, :user_password)
*/

// ADD LIST TO USER
/*
INSERT INTO BP_USER_LIST
VALUES (:USER_ID, :LIST_ID)
*/
exports.postListToUser = function postListToUser(connection, user_id, list) {
    return connection.execute(`
    INSERT INTO BP_SHOPPING_LIST
    VALUES (LIST_ID_SEQ.NEXTVAL, :LIST_NAME)`,
        [list.LIST_NAME
        ], {
            autoCommit: true
        })
        .then(
        (res2) => {
            return connection.execute(`
                                INSERT INTO BP_USER_LIST
                                VALUES (:USER_ID, LIST_ID_SEQ.CURRVAL)`,
                [user_id
                ], {
                    autoCommit: true
                })
                .then(
                (res3) => {
                    if (res3.rowsAffected === 0)
                        return Promise.reject({
                            location: `POST user`,
                            err: `Unsuccessful in adding list to user`
                        });
                    else {
                        return Promise.resolve({
                            status: 200,
                            data: `Successfully added list to user`
                        });
                    }

                },
                (err) => Promise.reject({
                    location: `POST user`,
                    err: err
                })
                );
        }
        )

};

// REMOVE LIST FROM USER
/*
DELETE FROM BP_USER_LIST
WHERE USER_ID = :USER_ID
AND LIST_ID = :LIST_ID
*/

