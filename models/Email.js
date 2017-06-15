const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const emailSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		required: 'Please Supply an Email Address'
	},
	tireType: {
		type: String,
		required: 'Please Supply a tire type!',
		trim: true
	},
	notifiedInStock: {
		type: Boolean,
		required: 'Please supply a type'
	}
});

module.exports = mongoose.model('Email', emailSchema);
