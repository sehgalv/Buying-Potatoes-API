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
        `SELECT li.LIST_ID, sl.LIST_NAME, i.item_id, i.item_name, i.item_description, ic.category_name
        FROM BP_USER_LIST ul 
        left join BP_LIST_ITEMS li on ul.list_id = li.list_id 
        left join BP_ITEM i on i.item_id = li.item_id
        left join BP_ITEM_CATEGORY ic on ic.item_id = li.item_id
        left join BP_SHOPPING_LIST sl on sl.list_id = li.list_id
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
                var tempListIDs = [];
                for(var i in res.rows){
                    var listIDName = {
                        list_id: res.rows[i].LIST_ID,
                        list_name: res.rows[i].list_name
                    };
                    tempListIDs.push(listIDName);
                    }
                    // var listIDs = tempListIDs.reduce(function(a, b){
                    //     if (a.indexOf(b.list_id) == -1 && a.indexOf(b.list_name) == -1) {
                    //         a.push({
                    //             list_id: b.list_id,
                    //             list_name: b.list_name})
                    //     }
                    //     return a;
                    // }, []);
                    var listIDs = tempListIDs.reduce(function(a, b){
                        if (a.indexOf(b.list_id) == -1) {
                            a.push(
                                b.list_id)
                        }
                        return a;
                    }, []);
                var itemsInList = [];
                console.log(listIDs, res.rows);
                for (var j in listIDs) {
                    var j_list_name;
                    var l_items = [];
                    for(var k in res.rows){
                        if (listIDs[j] === res.rows[k].LIST_ID){
                            j_list_name = res.rows[k].LIST_NAME;
                            l_items.push({
                                item_id: res.rows[k].ITEM_ID,
                                item_name: res.rows[k].ITEM_NAME,
                                item_desc: res.rows[k].ITEM_DESCRIPTION,
                                item_category: res.rows[k].CATEGORY_NAME
                            })
                        }
                    }
                    console.log(listIDs[j].LIST_ID);
                    itemsInList.push({
                        list_id: listIDs[j],
                        list_name: j_list_name,
                        items: l_items
                    });
                }
                return Promise.resolve({
                    status: 200,
                    data: itemsInList
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

// REMOVE LIST FROM USER
/*
DELETE FROM BP_USER_LIST
WHERE USER_ID = :USER_ID
AND LIST_ID = :LIST_ID
*/

