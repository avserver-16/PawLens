const express = require('express');
const router = express.Router();
const multer = require('multer');
const diagnosisController = require('../controllers/diagnosis.controller');
const authMiddleware = require('../middleswares/auth.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', upload.single('image'), diagnosisController.createDiagnosis);
router.get('/', diagnosisController.getUserDiagnoses);
router.get('/stats', diagnosisController.getStats);
router.get('/:id', diagnosisController.getDiagnosisById);
router.delete('/:id', diagnosisController.deleteDiagnosis);

module.exports = router;
