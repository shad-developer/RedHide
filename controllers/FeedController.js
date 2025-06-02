const AnimalFeed = require("../models/FeedModel");
const FeedStock = require("../models/FeedStockModel");
const Flock = require("../models/FlockModel");
const Animal = require("../models/AnimalModel")

module.exports.addAnimalFeed = async (req, res) => {
    try {
        const { flockName, silage, wanda, wheatStraw, feedTime, feedDate } = req.body;

        // Check if flock exists
        const flockExists = await Flock.findById(flockName);
        if (!flockExists) {
            return res.status(404).json({ message: "Flock not found" });
        }

        const parsedSilage = parseFloat(silage) || 0;
        const parsedWanda = parseFloat(wanda) || 0;
        const parsedWheatStraw = parseFloat(wheatStraw) || 0;

        // Check feed stock and update
        const feedTypes = [
            { type: "Silage", amount: parsedSilage },
            { type: "Wanda", amount: parsedWanda },
            { type: "Wheat Straw", amount: parsedWheatStraw },
        ];

        for (const feed of feedTypes) {
            if (feed.amount > 0) {
                const stock = await FeedStock.findOne({ feedType: feed.type });
                if (!stock) {
                    return res.status(404).json({ message: `${feed.type} stock not found` });
                }

                if (stock.currentStock < feed.amount) {
                    return res.status(400).json({ message: `Insufficient ${feed.type} stock` });
                }

                stock.currentStock -= feed.amount;
                await stock.save();
            }
        }

        // Normalize feedDate
        const normalizedDate = new Date(feedDate);
        normalizedDate.setHours(0, 0, 0, 0);

        // Check if a feed record already exists for this date and flock
        const existingFeed = await AnimalFeed.findOne({
            flockName,
            feedDate: normalizedDate
        });

        const feedData = {
            silage: silage || "",
            wanda: wanda || "",
            wheatStraw: wheatStraw || ""
        };

        let savedFeed;

        if (existingFeed) {
            if (feedTime === "Morning" && existingFeed.morning) {
                return res.status(400).json({ message: "Morning feed already added for this flock and date" });
            }
            if (feedTime === "Evening" && existingFeed.evening) {
                return res.status(400).json({ message: "Evening feed already added for this flock and date" });
            }

            // Add the new feed time
            if (feedTime === "Morning") {
                existingFeed.morning = feedData;
            } else {
                existingFeed.evening = feedData;
            }
            savedFeed = await existingFeed.save();
        } else {
            // Create a new feed document
            const newFeed = new AnimalFeed({
                flockName,
                feedDate: normalizedDate,
                morning: feedTime === "Morning" ? feedData : undefined,
                evening: feedTime === "Evening" ? feedData : undefined
            });

            savedFeed = await newFeed.save();
        }

        res.status(201).json({ message: "Animal Feed saved successfully", feed: savedFeed });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports.getAllAnimalFeeds = async (req, res) => {
    try {
        // Fetch all feeds with populated flock data
        const feeds = await AnimalFeed.find().populate("flockName");

        if (!feeds.length) {
            return res.status(404).json({ message: "No animal feeds found" });
        }

        // Add animal count to each feed
        const updatedFeeds = await Promise.all(
            feeds.map(async (feed) => {
                let animalCount = 1;

                if (feed.flockName && feed.flockName._id) {
                    animalCount = await Animal.countDocuments({ flock: feed.flockName._id }) || 1;
                }

                return {
                    ...feed.toObject(),
                    animalCount,
                };
            })
        );

        res.status(200).json(updatedFeeds);
    } catch (error) {
        console.error("Error fetching animal feeds:", error);
        res.status(500).json({ error: "Failed to fetch animal feeds" });
    }
};


module.exports.updateAnimalFeed = async (req, res) => {
    try {
        const { flockName, silage, wanda, wheatStraw, feedTime, feedDate } = req.body;

        // Validate Flock existence if flockName is being updated
        if (flockName) {
            const flockExists = await Flock.findById(flockName);
            if (!flockExists) {
                return res.status(404).json({ message: "Flock not found" });
            }
        }

        const updatedFeed = await AnimalFeed.findByIdAndUpdate(
            req.params.id,
            { flockName, silage, wanda, wheatStraw, feedTime, feedDate },
            { new: true, runValidators: true }
        );

        if (!updatedFeed) {
            return res.status(404).json({ message: "Animal Feed not found" });
        }

        res.status(200).json({ message: "Animal Feed updated successfully", feed: updatedFeed });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Animal Feed
module.exports.deleteAnimalFeed = async (req, res) => {
    try {
        const deletedFeed = await AnimalFeed.findByIdAndDelete(req.params.id);

        if (!deletedFeed) {
            return res.status(404).json({ message: "Animal Feed not found" });
        }

        res.status(200).json({ message: "Animal Feed deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete animal feed" });
    }
};
