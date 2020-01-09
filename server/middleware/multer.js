const multer = require('multer');

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    callback(null, name);
  },
});

module.exports = multer({ storage });
