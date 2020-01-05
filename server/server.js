const express, { json }= require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// **Intialize express**
const App = express();

// **Initialize middleware**
App.use(json({ extended: false }));
const isProduction = process.env.NODE_ENV === 'production';
const origin = {
  origin: isProduction ? 'https://www.heroku.com' : '*', // < ** UPDATE THIS LINE WHEN FRONTEND URL READY
};

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests,
});

App.use(limiter);
App.use(cors(origin));
App.use(compression());
App.use(helmet());

// **Routes*
App.use('/api', require('./routes/routes'));

App.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Charge API.' });
});

// **Initialize port & server**
const PORT = process.env.PORT || 5000;

const server = App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

module.exports = { server, PORT };
