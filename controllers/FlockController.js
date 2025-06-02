const FlockModel = require('../models/FlockModel');


module.exports.createFlock = async (req, res) => {
    try {
        const { flockName, startDate } = req.body;

        // Check if the flock already exists
        const existingFlock = await FlockModel.findOne({ flockName });
        if (existingFlock) {
            return res.status(409).json({ message: 'Flock already exists' });
        }

        // Create and save the new flock
        const newFlock = new FlockModel({
            flockName,
            startDate
        });

        const savedFlock = await newFlock.save();
        res.status(201).json({ message: "Flock Saved Successfully", savedFlock });
    } catch (err) {
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};



module.exports.getAllFlocks = async (req, res) => {
    try {
        const flocks = await FlockModel.find();
        if (!flocks) {
            res.status(404).json({ message: 'Flock not found' });
        }
        res.status(200).json(flocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getFlockById = async (req, res) => {
    try {
        const flock = await FlockModel.findById(req.params.id);
        if (!flock) {
            return res.status(404).json({ message: 'Flock not found' });
        }
        res.status(200).json(flock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.updateFlock = async (req, res) => {
    try {
        const { id } = req.params;
        const { flockName, startDate } = req.body;

        // Check if another flock with the same name exists (excluding the current one)
        if (flockName) {
            const existingFlock = await FlockModel.findOne({ flockName, _id: { $ne: id } });
            if (existingFlock) {
                return res.status(409).json({ message: 'Another flock with this name already exists' });
            }
        }

        const updatedFlock = await FlockModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        // If the flock is not found
        if (!updatedFlock) {
            return res.status(404).json({ message: 'Flock not found' });
        }

        res.status(200).json({ message: "Flock updated successfully", updatedFlock });
    } catch (err) {
        res.status(500).json({ error: "Server Error: " + err.message });
    }
};


module.exports.deleteFlock = async (req, res) => {
    try {
        const deletedFlock = await FlockModel.findByIdAndDelete(req.params.id);
        if (!deletedFlock) {
            return res.status(404).json({ message: 'Flock not found' });
        }
        res.status(200).json({ message: 'Flock deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};