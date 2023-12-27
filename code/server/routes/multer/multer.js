//**Multer for storing files */
const multer = require('multer');

// Set up multer storage for file uploads
const storage = multer.memoryStorage({});

const upload = multer({ storage: storage });

module.exports = {upload};