const animalModal = require('../models/AnimalModel');
const fs = require("fs");
const path = require("path");


module.exports.addAnimal = async (req, res) => {
    try {
        const { flockName, tagNumber, purchasePrice, purchaseWeight, purchaseDate } = req.body;

        if (!flockName || !tagNumber || !purchasePrice || !purchaseWeight || !purchaseDate) {
            return res.status(400).json({ message: 'Fill all fields' });
        }

        // Check if an animal with the same tagNumber exists in the same flock
        const existingAnimal = await animalModal.findOne({ tagNumber: tagNumber });
        if (existingAnimal) {
            return res.status(400).json({ message: 'Animal with this tag number already exists in this flock' });
        }

        let fileData = {};
        if (req.file) {
            fileData = {
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: `${req.protocol}://${req.get("host")}/uploads/image/${req.file.filename}`,
            };
        }

        const newAnimal = new animalModal({
            flock:flockName,
            tagNumber,
            purchasePrice,
            purchaseWeight,
            purchaseDate,
            image: fileData
        });

        await newAnimal.save();
        res.status(201).json({ message: 'Animal added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add animal' });
    }
};



module.exports.getAllAnimals = async (req, res) => {
    try {
        const animals = await animalModal.find().populate({ path: "flock" });
        if (!animals) {
            return res.status(404).json({ message: 'No animals found' });
        }
        res.status(200).json(animals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch animals' });
    }
};


module.exports.updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        let updatedData = { ...updates };

        const existingAnimal = await animalModal.findById(id);
        if (!existingAnimal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        // Check if the tag number is being updated
        if (updates.tagNumber) {
            const duplicateTag = await animalModal.findOne({
                tagNumber: updates.tagNumber,
                _id: { $ne: id } // Exclude the current animal being updated
            });

            if (duplicateTag) {
                return res.status(400).json({
                    message: 'Tag number already exists in this flock.'
                });
            }
        }

        // Handle image update
        if (req.file) {
            if (existingAnimal?.image?.filePath) {
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "uploads",
                    "image",
                    path.basename(existingAnimal.image.filePath)
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updatedData.image = {
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: `${req.protocol}://${req.get("host")}/uploads/image/${req.file.filename}`
            };
        }

        const updatedAnimal = await animalModal.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Animal updated successfully', animal: updatedAnimal });

    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ message: 'Failed to update animal', error: error.message });
    }
};



module.exports.deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnimal = await animalModal.findByIdAndDelete(id);
        if (!deletedAnimal) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.status(200).json({ message: 'Animal deleted successfully', animal: deletedAnimal });
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({ message: 'Failed to delete animal', error: error.message });
    }
}
