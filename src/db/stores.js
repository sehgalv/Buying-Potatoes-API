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
 * Gets single store's address from the SP_STORE table in the database based of STORE_ID requested
 * @param {*} connection  
 * @param {*} STORE_ID
 */
module.exports.getStoreAddress = function getStoreAddress(connection, STORE_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_STORE s join BP_ADDRESS ad
        on s.address_id = ad.address_id
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
 * Gets single store's hours from the SP_STORE table in the database based of STORE_ID requested
 * @param {*} connection  
 * @param {*} STORE_ID
 */
module.exports.getStoreHours = function getStoreHours(connection, STORE_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_STORE s left join BP_STORE_HOURS sthrs
        on s.store_id = sthrs.store_id
        WHERE s.STORE_ID=:STORE_ID`, [STORE_ID], {
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

// PUT STORE: add store, check if previously exists based on what factors?
/*
    INSERT INTO BP_STORE
    VALUES (SEQ.next, :STORE_NAME, :ADDRESS_ID, :PHONE_NUMBER)
*/

// PUT USER - STORE PAIR item in BP_ITEM_IN_STORE... check if pairing previously exists
/*
    INSERT INTO BP_STORE_OWNER
    VALUES (:USER_ID, :STORE_ID)
*/

// DELETE STORE??

// DELETE USER - STORE PAIR

/*
DELETE FROM BP_STORE_OWNER
WHERE STORE_ID = :STORE_ID
*/

// PUT HOURS.. if primary key exists, update hours
/*
INSERT INTO BP_STORE_HOURS
VALUES (:STORE_ID, :DAY, :OPEN, :CLOSE)
*/

