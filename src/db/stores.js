const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets all stores from the BP_STORE table in the database
 * @param {*} connection  
 */
module.exports.getStores = function getStores(connection) {
    return connection.execute(
        `SELECT so.STORE_ID, s.STORE_NAME, s.ADDRESS_ID,
        ad.STREET_NUMBER, ad.STREET_NAME, ad.APT_NUMBER, ad.CITY, ad.STATE_ABBREVIATION, ad.ZIP, ad.LATITUDE, ad.LONGITUDE,
        s.PHONE_NUMBER, so.USER_ID, sh.WEEKDAY, sh.OPEN_TIME, sh.CLOSE_TIME
        FROM BP_STORE_OWNER so left join BP_STORE s
        on so.store_id = s.store_id
        left join BP_ADDRESS ad
        on s.ADDRESS_ID = ad.ADDRESS_ID
        left join BP_STORE_HOURS sh
        on so.store_id = sh.store_id`, [],{
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
              console.log(res.rows);
              var tempStoreIds = [];
            for (var i in res.rows) {                             
                var storeInfo = {
                    STORE_ID: res.rows[i].STORE_ID,
                    STORE_NAME: res.rows[i].STORE_NAME,
                    ADDRESS: {
                        ADDRESS_ID: res.rows[i].ADDRESS_ID,
                        STREET_NUMBER: res.rows[i].STREET_NUMBER,
                        STREET_NAME: res.rows[i].STREET_NAME,
                        APT_NUMBER: res.rows[i].APT_NUMBER,
                        CITY: res.rows[i].CITY,
                        STATE: res.rows[i].STATE_ABBREVIATION,
                        ZIP: res.rows[i].ZIP,
                        LATITUDE: res.rows[i].LATITUDE,
                        LONGITUDE: res.rows[i].LONGITUDE
                    },
                    PHONE_NUMBER: res.rows[i].PHONE_NUMBER,
                    USER_ID: res.rows[i].USER_ID
                }
                tempStoreIds.push(storeInfo);
            }

            var storeIds = tempStoreIds.reduce(function(a, b){
                if (a.indexOf(b.STORE_ID) == -1) {
                    a.push(
                        b.STORE_ID)
                }
                return a;
            }, []);
            var addressOfStore = [];
            
            for (var j in storeIds) {
                var storeHours = [];
                var getStoreInfo =[];
                for (var k in res.rows) {
                    if(storeIds[j] === res.rows[k].STORE_ID) {
                        getStoreInfo = {
                            STORE_NAME: res.rows[k].STORE_NAME,
                            ADDRESS: {
                                ADDRESS_ID: res.rows[k].ADDRESS_ID,
                                STREET_NUMBER: res.rows[k].STREET_NUMBER,
                                STREET_NAME: res.rows[k].STREET_NAME,
                                APT_NUMBER: res.rows[k].APT_NUMBER,
                                CITY: res.rows[k].CITY,
                                STATE: res.rows[k].STATE_ABBREVIATION,
                                ZIP: res.rows[k].ZIP,
                                LATITUDE: res.rows[k].LATITUDE,
                                LONGITUDE: res.rows[k].LONGITUDE
                            },
                            PHONE_NUMBER: res.rows[k].PHONE_NUMBER,
                            USER_ID: res.rows[k].USER_ID
                        }

                        storeHours.push({
                            DAYOFWEEK: res.rows[k].WEEKDAY,
                            OPEN: res.rows[k].OPEN_TIME,
                            CLOSE: res.rows[i].CLOSE_TIME
                        });
                    }
                }
            
        addressOfStore.push({
                    STORE_ID: storeIds[j],
                    STORE_NAME: getStoreInfo.STORE_NAME,
                    ADDRESS: {
                        ADDRESS_ID: getStoreInfo.ADDRESS.ADDRESS_ID,
                        STREET_NUMBER: getStoreInfo.ADDRESS.STREET_NUMBER,
                        STREET_NAME: getStoreInfo.ADDRESS.STREET_NAME,
                        APT_NUMBER: getStoreInfo.ADDRESS.APT_NUMBER,
                        CITY: getStoreInfo.ADDRESS.CITY,
                        STATE: getStoreInfo.ADDRESS.STATE_ABBREVIATION,
                        ZIP: getStoreInfo.ADDRESS.ZIP,
                        LATITUDE: getStoreInfo.ADDRESS.LATITUDE,
                        LONGITUDE: getStoreInfo.ADDRESS.LONGITUDE
                    },
                    PHONE_NUMBER: getStoreInfo.PHONE_NUMBER,
                    USER_ID: getStoreInfo.USER_ID,
                    HOURS: storeHours
                });
            }


            return Promise.resolve({
                status: 200,
                data: addressOfStore
            });
        },
        (err) => {
            return Promise.reject({
                location: `Get stores`,
                err: 'get error',
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

