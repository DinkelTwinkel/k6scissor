const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const edgeKingSchema = new Schema({

	KimoServerID: { type: String, required: true, unique: true },
	currentKingID: { type: String, required: true, unique: false },
	edgeTime: { type: Number, required: true, unique: false },
	previousKingID: { type: String, required: true, unique: false },
	firstPostered: { type: Boolean, required: true, unique: false },

}, { timestamps: true });

const EdgeKing = mongoose.model('edgeKing', edgeKingSchema);
module.exports = EdgeKing;