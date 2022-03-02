const router = require('express').Router();
const { getHomePage, generateZip, removeZipFile } = require('../controllers/homeController');

router.get('/', getHomePage);
router.post('/', generateZip);
router.delete('/:name', removeZipFile);

module.exports = router;