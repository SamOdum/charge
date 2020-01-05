const { Router } = require('express');
const customer = require('../../controllers/customer');
const employees = require('../../controllers/employees');

// Importing endpoints to application resources
const authRoute = require('./authRoute');

const router = new Router();
const postLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
});

// Regular Endpoints
router.post('/log-in', employees.signin);
router.post('/credit/:accountNumber', postLimiter, Auth.verifyToken, customer.credit);

// Login/Register Router
router.use('/auth', authRoute);

module.exports = router;
