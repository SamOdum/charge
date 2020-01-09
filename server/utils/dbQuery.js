const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE,
} = process.env;

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

let pool;
if (process.env.NODE_ENV === 'production') {
  // On production server using heroku db connection string
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'test') {
  pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
} else {
  // created a Pool using local env default config on local
  pool = new Pool({ connectionString });
}

const dbQuery = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  },
  clearDb: async () => {
    const client = await pool.connect();
    await client.query('DROP TABLE IF EXISTS users CASCADE');
  },
};

module.exports = dbQuery;
