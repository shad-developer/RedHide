const express = require("express");
const router = express.Router();
const flockController = require("../controllers/FlockController");
const { protected, isAdmin } = require("../middleware/authMiddleware");

router.get("/getAllFlocks", protected, flockController.getAllFlocks);
router.post("/createNewFlock", protected, flockController.createFlock);
router.put("/updateFlockDetail/:id", protected, flockController.updateFlock);
router.delete("/deleteFlock/:id", protected, flockController.deleteFlock);


module.exports = router;
