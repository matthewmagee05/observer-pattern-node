const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const tireSchema = new Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true,
		required: 'Please Supply a tire name'
	},
	quantity: {
		type: String,
		required: 'Please Supply a tire quantity!',
		trim: true
	}
});

module.exports = mongoose.model('Tire', tireSchema);
