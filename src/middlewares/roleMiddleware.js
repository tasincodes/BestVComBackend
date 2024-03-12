const { HEAD_OFFICE,BRANCH_ADMIN,CUSTOMER } = require('../config/constants');
const { Unauthorized } = require('../utility/errors');

module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.role) && !roles.includes(HEAD_OFFICE, BRANCH_ADMIN,CUSTOMER))
    throw new Unauthorized('You dont have permissions for this action');
  next();
};
