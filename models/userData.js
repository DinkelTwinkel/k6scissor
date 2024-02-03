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
	profilePicture: ({ type: String, default: 'https://cdn.discordapp.com/attachments/1192661895296073780/1202745654816940032/0rebqwiri5w61.gif?ex=65ce932e&is=65bc1e2e&hm=b0defd1a38b58e0b3cd22db39cd114dcc6fade735cbff29ac6fb6ee5e826af93&' }),
    profileColour: ({ type: String, default: '#9e5b08' }),
	group: ({ type: Number, default: 0 })

}, { timestamps: true });

const UserData = mongoose.model('userData', userDataSchema);
module.exports = UserData;