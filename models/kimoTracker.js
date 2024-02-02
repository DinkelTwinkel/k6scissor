const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kimoTracker = new Schema({

	serverId: { type: String, required: true, unique: true },
	currentDate: { type: Number, required: true },
	nextDate: { type: Number, default: 0 },
	kimoActive: { type: Boolean, default: false },
	dailyDeadline: { type: Number, default: 12 },

}, { timestamps: true });

const KimoTracker = mongoose.model('kimoTracker', kimoTracker);
module.exports = KimoTracker;