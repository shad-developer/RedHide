const mongoose = require("mongoose");

const FeedDetailsSchema = new mongoose.Schema({
    silage: { type: String },
    wanda: { type: String },
    wheatStraw: { type: String }
});

const FeedSchema = new mongoose.Schema({
    flockName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flock",
        required: true
    },
    feedDate: {
        type: Date,
        required: true,
    },
    morning: FeedDetailsSchema,
    evening: FeedDetailsSchema
}, {
    timestamps: true
});

module.exports = mongoose.model("AnimalFeed", FeedSchema);
