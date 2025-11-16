const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Public endpoints - Performance data queries
router.get('/brands', dataController.getBrands);
router.get('/models', dataController.getModels);
router.get('/engines', dataController.getEngines);
router.get('/stages', dataController.getStages);
router.get('/power', dataController.getPowerData);

// Admin endpoints - Protected
router.post('/data', authMiddleware, adminController.getData);
router.post('/save', authMiddleware, adminController.saveData);
router.get('/backups', authMiddleware, adminController.listBackups);

module.exports = router;
