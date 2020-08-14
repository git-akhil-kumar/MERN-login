const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CourseSchema = new mongoose.Schema({
	name: {
		type: String,
		default: ''
	},
	details: {
		type: String,
		default: '',
	},
	timestamp: {
		type: Date,
		default: Date.now()
	},
});

module.exports = mongoose.model('CourseSession', CourseSchema);
