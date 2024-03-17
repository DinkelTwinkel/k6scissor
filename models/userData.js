const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataSchema = new Schema({

	userID: { type: String, required: true, unique: true },
	name: ({ type: String, default: 'n/a' }),
	socialLink: ({ type: String, default: 'n/a' }),
	pronouns: ({ type: String, default: 'n/a' }),
	bio: ({ type: String, default: 'BIO: Use /SETID to fill in your player card!' }),
	interests: ({ type: String, default: 'n/a' }),
	energy: ({ type: Number, default: 1 }),
	money: ({ type: Number, default: 0 }),
	profilePicture: ({ type: String, default: 'https://cdn.discordapp.com/attachments/1154159412160757810/1205149790355197983/default-player-character.gif?ex=65d75234&is=65c4dd34&hm=e301ebd9079bc14021af1bc0a06508d5e5a46284c1072a8a4a3a18834719d5c1&' }),
    profileColour: ({ type: String, default: '#9e5b08' }),
	group: ({ type: Number, default: 0 }),
	emojiReactAwardAmount: ({ type: Number, default: 0 }),

}, { timestamps: true });

const UserData = mongoose.model('userData', userDataSchema);
module.exports = UserData;