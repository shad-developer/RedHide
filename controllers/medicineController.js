const Medicine = require("../models/medicineModel");
const mongoose = require("mongoose");

module.exports.addMedicineToFlock = async (req, res) => {
    try {
        const { flockId } = req.params;
        const { vaccineName, vaccinationDate, dosage, cost } = req.body;

        if (!vaccineName || !vaccinationDate || !dosage || cost === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if Medicine document exists for the given flockId
        let medicine = await Medicine.findOne({ flockId: flockId });

        const newVaccination = {
            vaccineName,
            vaccinationDate,
            dosage,
            cost: Number(cost)
        };

        if (!medicine) {
            // If not exists, create a new Medicine document
            medicine = new Medicine({
                flockId: flockId,
                vaccination: [newVaccination],
                totalCost: Number(cost)
            });
        } else {
            // If exists, push the new vaccination and update totalCost
            medicine.vaccination.push(newVaccination);
            medicine.totalCost = medicine.vaccination.reduce((sum, v) => sum + v.cost, 0);
        }

        await medicine.save();

        res.status(201).json({ message: 'Vaccination added to flock successfully', data: medicine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports.getMedicineByFlockId = async (req, res) => {
    try {
        const { flockId } = req.params;
        const medicine = await Medicine.findOne({ flockId: flockId });
        if (!medicine) {
            return res.status(404).json({
                error: 'Medicine not found for the given flockId'
            });
        }
        res.status(200).json({ message: 'Medicine details retrieved successfully', data: medicine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// get all medicine
module.exports.getAllMedicine = async (req, res) => {
    try {
        const medicines = await Medicine.find().populate('flockId');

        if (!medicines || medicines.length === 0) {
            return res.status(404).json({ error: 'No medicine records found' });
        }

        res.status(200).json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// get medicine by flock id
module.exports.getMedicineByFlockId = async (req, res) => {
    try {
        const { flockId } = req.params;
        const medicine = await Medicine.findOne({ flockId: flockId }).populate('flockId');
        if (!medicine) {
            return res.status(404).json({
                error: 'Medicine not found for the given flockId'
            });
        }
        res.status(200).json(medicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// delete vaccination by vaccinationId from inside the array
module.exports.deleteVaccinationById = async (req, res) => {
    try {
        const { flockId, vaccinationId } = req.params;

        // Find the medicine document for the given flockId
        const medicine = await Medicine.findOne({ flockId: flockId });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Find the vaccination to delete
        const vaccinationToDelete = medicine.vaccination.find(v => v._id.toString() === vaccinationId);
        if (!vaccinationToDelete) {
            return res.status(404).json({ error: 'Vaccination not found' });
        }

        // Remove the vaccination from the array
        medicine.vaccination = medicine.vaccination.filter(v => v._id.toString() !== vaccinationId);

        // Subtract the cost from totalCost
        medicine.totalCost = (medicine.totalCost || 0) - (vaccinationToDelete.cost || 0);
        if (medicine.totalCost < 0) medicine.totalCost = 0; // Just in case

        // Save the updated document
        await medicine.save();

        res.status(200).json({
            message: 'Vaccination deleted successfully',
            updatedMedicine: medicine
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



// delete medicine by main _id
module.exports.deleteMedicineById = async (req, res) => {
    try {
        const { medicineId } = req.params;
        // Find the medicine document for the given medicineId
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        // Delete the medicine document
        await Medicine.findByIdAndDelete(medicineId);
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



// update vaccination by flock id
module.exports.updateVaccinationById = async (req, res) => {
    try {
        const { flockId } = req.params;
        const { vaccineName, vaccinationDate, dosage, cost, _id: vaccinationId } = req.body;

        if (!vaccineName || !vaccinationDate || !dosage || cost === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const medicine = await Medicine.findOne({ flockId });
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Update the vaccination entry
        medicine.vaccination = medicine.vaccination.map(v => {
            if (v._id.toString() === vaccinationId) {
                return {
                    ...v.toObject(),  // preserve _id and other fields
                    vaccineName,
                    vaccinationDate,
                    dosage,
                    cost: Number(cost)
                };
            }
            return v;
        });

        // Reset and recalculate totalCost
        medicine.totalCost = medicine.vaccination.reduce((sum, v) => sum + Number(v.cost), 0);

        await medicine.save();

        res.status(200).json({ message: 'Vaccination updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
