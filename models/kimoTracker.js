const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kimoTracker = new Schema({

	serverId: { type: String, required: true, unique: true },
	currentDate: { type: Number, required: true },
	nextDate: { type: Number, default: 0 },
	kimoActive: { type: Boolean, default: false },
	kimoInfiniteMode: { type: Boolean, default: false },
	kimoLiveDays: { type: Number, required: true,  default: 0  },
	deadKickedToday: { type: Boolean, default: false },
	alarmOne: { type: Boolean, default: false },
	alarmTwo: { type: Boolean, default: false },
	alarmThree: { type: Boolean, default: false },
	currentPeriodLength: { type: Number, default: 0 },
	slaughter: { type: Boolean, default: false },

}, { timestamps: true });

const KimoTracker = mongoose.model('kimoTracker', kimoTracker);
module.exports = KimoTracker;