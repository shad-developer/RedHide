const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlockSchema = new Schema(
  {
    flockName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flock', FlockSchema);
