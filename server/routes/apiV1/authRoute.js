const { Router } = require('express');
const { Auth } = require('../../middleware/Auth');
const employees = require('../../controllers/employees');

const router = new Router();

// router.post("/supr", Auth.isSuperAdmin, employees.createBare);
router.post('/create-agent', Auth.verifyToken, Auth.isAdmin, employees.createBare);
router.delete('/delete-agent', Auth.verifyToken, Auth.isAdmin, employees.deleteBare);

module.exports = routers
