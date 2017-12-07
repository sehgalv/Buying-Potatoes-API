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
    return connection.execute(`
        INSERT INTO BP_ADDRESS
        VALUES (
            address_id_seq.nextval,
            :street_number,
            :street_name,
            :apt_number,
            :city,
            :state_abbreviation,
            :zip)`,
            [address.street_number,
            address.street_name,
            address.apt_number,
            address.city,
            address.state_abbreviation,
            address.zip
            ], {
        outFormat: oracledb.OBJECT
    })
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