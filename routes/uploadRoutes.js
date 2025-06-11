const express = require('express');
const router = express.Router();
const { upload, uploadFiles } = require('../controllers/uploadController');

router.post('/', upload.single('file'), uploadFiles);


module.exports = router;
