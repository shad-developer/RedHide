const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimalSchema = new Schema(
  {
    tagNumber: {
      type: String
    },
    purchasePrice: {
      type: String,
    },
    purchaseWeight: {
      type: String
    },
    purchaseDate: {
      type: Date
    },
    image: {
      type: Object,
      default: {}
    },
    flock: {
      type: Schema.Types.ObjectId,
      ref: 'Flock',  
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animals", AnimalSchema);
