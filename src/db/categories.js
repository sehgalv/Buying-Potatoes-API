const routes = require('../routes');
// const format = routes.format;

/**
 * Get's single address from the BP_ADDRESS table in the database based of ADDRESS_ID requested
 * @param {*} connection  
 */
module.exports.getCategories = function getCategories(connection) {
    return connection.execute(
        `SELECT * FROM BP_CATEGORY`, []
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
 * Get's single address from the BP_ADDRESS table in the database based of ADDRESS_ID requested
 * @param {*} connection  
 * @param {*} ITEM_ID
 */
module.exports.getItemCategories = function getItemCategories(connection, ITEM_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ITEM_CATEGORY
        WHERE ITEM_ID=:ITEM_ID`, [ITEM_ID]
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


/**
 * Adds address to BP_ADDRESS table in the database
 * @param {*} connection 
 * @param {*} ADDRESS_ID 
 */
exports.putAddress = function putAddress(connection, ADDRESS_ID){
    return connection.execute(`
        INSERT INTO BP_ADDRESS
        VALUES (:ADDRESS_ID)
    `, [ADDRESS_ID])
    .then(
        (res) => {
            if(res.rowsAffected === 0)  
                return Promise.reject({
                    location: `PUT address`,
                    err: `Unsuccessful in adding address`
                });
            else
                return Promise.resolve({
                    status: 200,
                    data: `Successfully added address ${ADDRESS_ID}`
                });
        },
        (err) => Promise.reject({
            location: `PUT address`,
            err: err
        })
    );
};