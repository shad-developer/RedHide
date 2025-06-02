const express = require("express");
const router = express.Router();
const animalController = require("../controllers/AnimalController");
const { protected, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.get("/getAllAnimals",  protected, animalController.getAllAnimals);
router.post("/addAnimal", protected, upload.single("image"), animalController.addAnimal);
router.put("/updateAnimal/:id", protected, upload.single("image"), animalController.updateAnimal);
router.delete("/deleteAnimal/:id", protected, animalController.deleteAnimal);


module.exports = router;
