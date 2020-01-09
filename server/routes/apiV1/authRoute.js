const { Router } = require('express');
const { Auth } = require('../../middleware/auth');
const employees = require('../../controllers/employees');

const router = new Router();

// router.post("/supr", Auth.isSuperAdmin, employees.createBare);
router.post('/create-employee', Auth.verifyToken, Auth.isAdmin, employees.create);
router.delete('/delete-agent', Auth.verifyToken, Auth.isAdmin, employees.deleteBare);
router.post('/deactivate-employee', Auth.verifyToken, Auth.isAdmin, employees.deactivate);
router.post('/reactivate-employee', Auth.verifyToken, Auth.isAdmin, employees.reactivate);

module.exports = router;
