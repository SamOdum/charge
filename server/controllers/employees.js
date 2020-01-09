// const uuidv4 = require('uuid/v4');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const db = require('../utils/dbQuery');
const { Helper } = require('../middleware/auth');

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Employees = {
  query: {
    createQuery: `INSERT INTO
  employees(firstname, lastname, email, password, gender, jobrole, department, address, role, url, publicid)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
    deactivateSystemRole: 'UPDATE employees SET systemrole = $1 WHERE email = $2 returning *',
    reactivateSystemRole: 'UPDATE employees SET systemrole = $1 WHERE email = $2 returning *',
    findUser: 'SELECT * FROM employees WHERE userid = $1',
    deleteUser: 'DELETE FROM employees WHERE userid = $1 returning *',
  },

  /**
   * Create employee with picture
   * @param {object} req
   * @param {object} res
   * @returns {object} employee object
   */
  async create(req, res) {
    const file = req.files[0].path;

    // **Upload file to Cloudinary, then database
    cloudinary.uploader.upload(file,
      { folder: 'charge/employees' }, // This refers to the file storage location on Cloudinary
      async (error, result) => {
        const passwordHash = Helper.hashPassword(req.body.password);
        const values = [req.body.firstName, req.body.lastName, req.body.email, passwordHash, req.body.gender, req.body.jobRole, req.body.department, req.body.address, req.body.role || 'basic', result.url, result.public_id];

        try {
          const { rows } = await db.query(Employees.query.createQuery, values);
          const userId = rows[0].userid;
          const token = Helper.generateToken(userId);
          return res.status(201).json({
            status: 'success', data: { message: 'User account successfully created', token, userId },
          });
        } catch (err) {
          return res.status(400).send({ status: 'error', error: { message: err } });
        }
      });
  },

  /**
   * Delete An Employee
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async delete(req, res) {
    const userId = req.body.userUniqueId;
    const findQuery = Employees.query.findUser;
    const deleteQuery = Employees.query.deleteUser;
    try {
      const { rows } = await db.query(findQuery, [userId]);
      if (!rows[0]) {
        return res.status(404).send({ status: 'error', error: { message: 'User not found' } });
      }
      cloudinary.uploader.destroy(rows[0].publicid);
      const response = await db.query(deleteQuery, [userId]);
      if (!response.rows[0]) {
        return res.status(404).json({ status: 'error', error: { message: 'Employee not found' } });
      }
      return res.status(202).json({ status: 'success', data: { message: 'User successfully deleted' } });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  },

  /**
   * Deactivate An Employee
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async deactivate(req, res) {
    const employeeEmail = req.body.employeeemail;
    const findQuery = Employees.query.findUser;

    try {
      const { rows } = await db.query(findQuery, [employeeEmail]);
      if (!rows[0]) {
        return res.status(404).send({ status: 'error', error: { message: 'User not found' } });
      }
      const values = [
        'deactivated',
        employeeEmail,
      ];
      await db.query(Employees.query.deactivateSystemRole, values);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Employee successfully deactivadated',
        },
      });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  },

  /**
   * Reactivate An Employee
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async reactivate(req, res) {
    const employeeEmail = req.body.employeeemail;
    const findQuery = Employees.query.findUser;

    try {
      const { rows } = await db.query(findQuery, [employeeEmail]);
      if (!rows[0]) {
        return res.status(404).send({ status: 'error', error: { message: 'User not found' } });
      }
      const values = [
        'active',
        employeeEmail,
      ];
      await db.query(Employees.query.reactivateSystemRole, values);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Employee successfully re-activated',
        },
      });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  },
};

module.exports = Employees;
