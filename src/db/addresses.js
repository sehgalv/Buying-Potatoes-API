const routes = require('../routes');
var oracledb = require('oracledb');

/**
 * Gets all addresses from the BP_ADDRESSES table in the database
 * @param {*} connection  
 */
module.exports.getAddresses = function getAddresses(connection) {
    return connection.execute(
        `SELECT * FROM BP_ADDRESS`, [], {
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
                location: `Get addresses`,
                err: any,
            })
        }
    );
};

/**
 * Gets single address from the BP_ADDRESS table in the database based of ADDRESS_ID requested
 * @param {*} connection 
 * @param {*} ADDRESS_ID 
 */

module.exports.getAddress = function getAddress(connection, ADDRESS_ID) {
    return connection.execute(
        `SELECT * 
        FROM BP_ADDRESS 
        WHERE ADDRESS_ID= :ADDRESS_ID`, [ADDRESS_ID], {
            outFormat: oracledb.OBJECT
        }
    )
    .then(
        (res) => {
            if(res.rows.length === 0) {
                return Promise.reject({
                    location: `Address with id'${ADDRESS_ID}' does not exist.`,
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
                location: `Get address`,
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
exports.putAddress = function putAddress(connection, address){
    console.log(address);
    return connection.execute(`
        INSERT INTO BP_ADDRESS
        VALUES (
            ADDRESS_ID_SEQ.NEXTVAL,
            :STREET_NUMBER,
            :STREET_NAME,
            :APT_NUMBER,
            :CITY,
            :STATE_ABBREVIATION,
            :ZIP,
            :LATITUDE,
            :LONGITUDE)`,
            [address.STREET_NUMBER,
            address.STREET_NAME,
            address.APT_NUMBER,
            address.CITY,
            address.STATE_ABBREVIATION,
            address.ZIP,
            address.LATITUDE,
            address.LONGITUDE
            ], {})
    .then(
        (res) => {
            if(res.rowsAffected === 0)  
                return Promise.reject({
                    location: `PUT address`,
                    err: `Unsuccessful in adding address`
                });
            else
                {
                    console.log(JSON.stringify(res));
                    return Promise.resolve({
                        status: 200,
                        data: `Successfully added address`
                    });
                }
                
        },
        (err) => Promise.reject({
            location: `PUT address`,
            err: err
        })
    );
};