const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../utils/dbQuery');

dotenv.config();


const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return validator.isEmail(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.SECRET, { expiresIn: '4d' });
    return token;
  },
};

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) {
      return res.status(400).send({ status: 'error', error: 'No token provided' });
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM employees WHERE userid = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        return res.status(400).send({ status: 'error', error: 'Invalid token provided' });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
    return true; // **  <= Be wary of this line here
  },

  async isAdmin(req, res, next) {
    const token = req.headers['x-auth-token'];
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM employees WHERE userid = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (rows[0].role !== 'admin') {
        return res.status(401).send({ status: 'error', error: 'Not authorized to access resource' });
      }
      next();
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
    return true; // **  <= Be wary of this line here
  },

  async isSuperAdmin(req, res, next) {
    const { superCode } = req.body;
    const { SUPERCODE } = process.env;
    try {
      if (superCode !== SUPERCODE) {
        return res.status(403).send({ status: 'error', error: 'Not authorized to access resource' });
      }
      next();
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
    return true; // **  <= Be wary of this line here
  },
};

module.exports = { Auth, Helper };
