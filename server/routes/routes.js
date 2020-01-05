const { Router } = require('express');

/**
 * *** Import API versions ***
 */
const apiV1 = require('./apiV1/routeEntry');

/**
 * *** Creating an express Router object.
 */
const router = new Router();

/**
 * Routing based on the API version used by the client.
 * Currently only API v1 is available.
 */
router.use('/v1', apiV1);

module.exports = router;
