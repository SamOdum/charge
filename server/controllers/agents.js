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
    findUser: 'SELECT * FROM employees WHERE userid = $1',
    deleteUser: 'DELETE FROM employees WHERE userid = $1 returning *',
  },
  /**
   * Create An Employee
   * @param {object} req
   * @param {object} res
   * @returns {object} employee object
   */
  async createBare(req, res) {
    const text = `INSERT INTO
      employees(firstname, lastname, email, password, gender, jobrole, department, address, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;

    // **Encrypt user's password
    const passwordHash = Helper.hashPassword(req.body.password);

    const values = [req.body.firstName, req.body.lastName, req.body.email, passwordHash, req.body.gender, req.body.jobRole, req.body.department, req.body.address, req.body.role || 'basic'];

    try {
      const { rows } = await db.query(text, values);
      const userId = rows[0].userid;
      const token = Helper.generateToken(userId);
      return res.status(201).json({
        status: 'success', data: { message: 'User account successfully created', token, userId },
      });
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  },

  /**
   * Create employee with picture
   * @param {object} req
   * @param {object} res
   * @returns {object} employee object
   */
  async create(req, res) {
    const file = req.files[0].path;

    // **Upload file to Cloudinary then database
    cloudinary.uploader.upload(file,
      { folder: 'teamwork/users' },
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
};
