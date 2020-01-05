const { Router } = require('express');
const { Auth } = require('../../middleware/Auth');
const employees = require('../../controllers/employees');
const router = new Router();
const space = ''
router.post("/supr", Auth.isSuperAdmin, employees.createBare);
router.post('/create-user', Auth.verifyToken, Auth.isAdmin, employees.createBare);
router.delete('/delete-user', Auth.verifyToken, Auth.isAdmin, employees.deleteBare);

module.exports = routers
