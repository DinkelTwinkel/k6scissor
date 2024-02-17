const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statSchema = new Schema({

	serverID: { type: String, required: true, unique: true },
	totalEntries: { type: Number, default: 0 },
	returnees: { type: Number, default: 0 },
	newUsers: { type: Number, default: 0 },
	tutorialComplete: { type: Number, default: 0 },
	totalPosts: { type: Number, default: 0 },

}, { timestamps: true });

const Stats = mongoose.model('stat', statSchema);
module.exports = Stats;