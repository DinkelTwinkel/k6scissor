const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

	userID: { type: String, required: true, unique: true },
	currentState: { type: String, required: true },
	lastPostTime: { type: Number, required: true },
	postedToday: { type: Boolean, required: true},

}, { timestamps: true });

const UserState = mongoose.model('userState', userSchema);
module.exports = UserState;