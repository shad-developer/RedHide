const FeedStockModel = require('../models/FeedStockModel');

module.exports.addFeedStock = async (req, res) => {
    try {
        const { feedType, purchaseWeight, purchasePrice, purchaseDate } = req.body;

        if (!feedType || !purchaseWeight || !purchasePrice || !purchaseDate) {
            return res.status(400).json({
                message: 'All Fields are required.',
            });
        }

        // Check if the feed type already exists
        let feedStock = await FeedStockModel.findOne({ feedType });

        if (feedStock) {
            // If feed type exists, update the stock and add to purchase history
            feedStock.currentStock += Number(purchaseWeight);
            feedStock.purchaseHistory.push({
                purchaseWeight,
                pricePerUnit: purchasePrice,
                purchaseDate,
            });
        } else {
            // Create new feed stock if it doesn't exist
            feedStock = new FeedStockModel({
                feedType,
                currentStock: Number(purchaseWeight),
                purchaseHistory: [
                    {
                        purchaseWeight,
                        pricePerUnit: purchasePrice,
                        purchaseDate,
                    },
                ],
            });
        }

        // Save to database
        const savedFeedStock = await feedStock.save();
        res.status(201).json({
            message: 'Feed stock added successfully.',
            feedStock: savedFeedStock,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while adding feed stock.',
            error: error.message,
        });
    }
};


module.exports.getFeedstock = async (req, res) => {
    try {
        const feedstocks = await FeedStockModel.find();
        res.status(200).json(feedstocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching feedstock.' });
    }
};


module.exports.getFeedStockByID = async (req, res) => {
    try {
        const { feedStockId } = req.params;
        const feedStock = await FeedStockModel.findById(feedStockId);
        if (!feedStock) {
            return res.status(404).json({ message: 'Feed stock not found.' });
        }
        res.status(200).json(feedStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching feedstock.' });
    }
};


// delete feed stock history

module.exports.deleteFeedStockHistory = async (req, res) => {
    try {
        const { feedStockId, feedHistoryId } = req.params;
        const feedStock = await FeedStockModel.findById(feedStockId);

        if (!feedStock) {
            return res.status(404).json({ message: 'Feed stock not found.' });
        }

        let deletedHistoryItem;
        feedStock.purchaseHistory = feedStock.purchaseHistory.filter(
            (history) => {
                const isMatch = history._id.toString() === feedHistoryId;
                if (isMatch) {
                    deletedHistoryItem = history;
                }
                return !isMatch; // Keep items where IDs don't match
            }
        );

        if (deletedHistoryItem) {
            feedStock.currentStock -= deletedHistoryItem.purchaseWeight;
        }

        await feedStock.save();
        res.status(200).json({ message: 'Feed stock history deleted successfully.', updatedStock: feedStock.currentStock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting feed stock history and updating stock.' });
    }
};

module.exports.updateFeedStockHistory = async (req, res) => {
    try {
        const { feedStockId, feedHistoryId } = req.params;
        const { purchaseDate, purchaseWeight, pricePerUnit } = req.body;

        const feedStock = await FeedStockModel.findById(feedStockId);

        if (!feedStock) {
            return res.status(404).json({ message: 'Feed stock not found.' });
        }

        const historyIndex = feedStock.purchaseHistory.findIndex(
            (history) => history._id.toString() === feedHistoryId
        );

        if (historyIndex === -1) {
            return res.status(404).json({ message: 'Feed stock history item not found.' });
        }

        const oldPurchaseWeight = feedStock.purchaseHistory[historyIndex].purchaseWeight;

        // Update the history item
        if (purchaseDate) {
            feedStock.purchaseHistory[historyIndex].purchaseDate = purchaseDate;
        }
        if (purchaseWeight !== undefined) { // Allow updating to 0
            feedStock.purchaseHistory[historyIndex].purchaseWeight = purchaseWeight;
        }
        if (pricePerUnit) {
            feedStock.purchaseHistory[historyIndex].pricePerUnit = pricePerUnit;
        }

        // Update currentStock based on the change in purchaseWeight
        if (purchaseWeight !== undefined && oldPurchaseWeight !== purchaseWeight) {
            feedStock.currentStock = feedStock.currentStock - oldPurchaseWeight + purchaseWeight;
        }

        await feedStock.save();
        res.status(200).json({
            message: 'Feed stock history updated successfully.',
            data: feedStock.purchaseHistory[historyIndex],
            updatedStock: feedStock.currentStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating feed stock history and stock.' });
    }
};