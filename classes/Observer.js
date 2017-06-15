const mail = require('../handlers/mail');
const promisify = require('es6-promisify');
class Observer {
	constructor(id, subject) {
		this.id = id;
		this.subject = subject;
		this.subject.addListener('change', data => this.onChange(data));
	}
	onChange(data) {
		console.log(`${this.id} notified of change:`, data);
		mail.send({
			email: data.email,
			tireType: data.tireType,
			quantity: data.quantity,
			subject: 'Tire Stock Status',
			filename: data.filename
		});
	}
}

module.exports = Observer;
