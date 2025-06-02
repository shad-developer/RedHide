const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get("/getAllMedicine", medicineController.getAllMedicine);
router.get("/getMedicineByFlockId/:flockId", medicineController.getMedicineByFlockId);
router.post("/addMedicineToFlock/:flockId", medicineController.addMedicineToFlock)
router.put("/updateVaccinationById/:flockId", medicineController.updateVaccinationById)
router.delete("/deleteVaccinationById/:flockId/:vaccinationId", medicineController.deleteVaccinationById)
router.delete("/deleteMedicineById/:medicineId", medicineController.deleteMedicineById)

module.exports = router;