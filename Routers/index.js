module.exports = function (app) {

    const AdminToken = require('./AdminToken'); 
    const UserToken = require('./UserToken'); 

    app.use('/api', require('./unauthenticated'));
    app.use('/api/admin', [AdminToken.check_admin_token], require('./admin_auth'));
    app.use('/api/employee', [UserToken.checkUserToken], require('./user_auth'));
};
