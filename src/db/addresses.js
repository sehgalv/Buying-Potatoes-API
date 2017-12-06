const routes = require('../routes');
// const format = routes.format;

module.exports.getAddresses = function getAddresses(connection) {
    return connection.execute(
        `SELECT * FROM BP_ADDRESS`, []
    )
    .then(
        (res) => {
            return Promise.resolve({
                status: 200,
                data: res
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