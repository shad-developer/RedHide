const express = require("express");
const router = express.Router();
const feedController = require("../controllers/FeedStockController");
const { protected, isAdmin } = require("../middleware/authMiddleware");

router.get("/getAllFeedStocks", protected, feedController.getFeedstock);
router.get("/getFeedStockByID/:feedStockId", protected, feedController.getFeedStockByID);
router.post("/addFeedStock", protected, feedController.addFeedStock);
router.put("/:feedStockId/history/:feedHistoryId", protected, feedController.updateFeedStockHistory);
router.delete("/:feedStockId/history/:feedHistoryId", protected, feedController.deleteFeedStockHistory);

module.exports = router;
