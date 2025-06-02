const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vaccinationModel = {
    vaccineName: String,
    vaccinationDate: Date,
    dosage: String,
    cost: Number
}


const medicineSchema = new Schema({
    flockId: {
        type: Schema.Types.ObjectId,
        ref: 'Flock',
    },
    totalCost: Number,
    vaccination: [vaccinationModel],
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);