const processMongoError = (err, status = undefined) => ({
    status: status ? status : 400,
    message: err.message,
});

module.exports = {
    processMongoError,
};