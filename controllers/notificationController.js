const mongoose = require('mongoose');
const Tire = mongoose.model('Tire');
const Email = mongoose.model('Email');
const EventEmitter = require('../classes/EventEmitter');
const Observer = require('../classes/Observer');

exports.loadHomepage = async (req, res) => {
	const tiresPromise = Tire.find().sort({ name: 'asc' });
	const tires = await Promise.all([tiresPromise]);

	res.render('index', { title: 'Magee Tires', success: '', tires });
};

exports.submitEmail = (req, res) => {
	const user = new Email({ email: req.body.email, tireType: req.body.tirePicker, notifiedInStock: false }).save();
	res.redirect('/');
};

exports.loadAdmin = async (req, res) => {
	let tireArr = [];
	const tiresPromise = Tire.find().sort({ name: 'asc' });
	const tires = await Promise.all([tiresPromise]);
	tires[0].forEach(item => {
		tireArr.push({ name: item.name, quantity: item.quantity });
	});
	res.render('admin', { title: 'Magee Tires Admin Panel', tireArr });
};

exports.updateQuantity = async (req, res, next) => {
	const tire1 = await Tire.update({ name: 'michelin' }, { $set: { quantity: req.body.michelinQuantity } }).exec();
	const tire2 = await Tire.update(
		{ name: 'bridgestone' },
		{ $set: { quantity: req.body.bridgestoneQuantity } }
	).exec();
	const tire3 = await Tire.update({ name: 'firestone' }, { $set: { quantity: req.body.firestoneQuantity } }).exec();
	next();
};

exports.sendNotification = async (req, res) => {
	let tireArr = [];
	let emailArr = [];
	const tiresPromise = Tire.find().sort({ name: 'asc' });
	const tires = await Promise.all([tiresPromise]);

	const emailPromise = Email.find();
	const emails = await Promise.all([emailPromise]);

	emails[0].forEach(item => {
		emailArr.push({
			id: item._id,
			email: item.email,
			tireType: item.tireType,
			notifiedInStock: item.notifiedInStock
		});
	});

	tires[0].forEach(item => {
		tireArr.push({ name: item.name, quantity: item.quantity });
	});

	let bridgestoneNotify = emailArr.filter(filterBridgestone);
	let michelinNotify = emailArr.filter(filterMichelin);
	let firestoneNotify = emailArr.filter(filterFirestone);

	await notify(bridgestoneNotify, tireArr[0]);
	setTimeout(() => {
		notify(michelinNotify, tireArr[2]);
	}, 2000);

	setTimeout(() => {
		notify(firestoneNotify, tireArr[1]);
	}, 2000);

	res.redirect('/');
};

function filterBridgestone(val) {
	return val.tireType.toLowerCase() == 'bridgestone';
}

function filterMichelin(val) {
	return val.tireType.toLowerCase() == 'michelin';
}

function filterFirestone(val) {
	return val.tireType.toLowerCase() == 'firestone';
}

async function notify(notification, tireArr) {
	let observable = new EventEmitter();
	let observer1 = new Observer('tire inventory', observable);
	for (member in notification) {
		console.log(notification[member].email);
		if (tireArr.quantity > 0 && notification[member].notifiedInStock == false) {
			let a = await Email.update({ _id: notification[member].id }, { $set: { notifiedInStock: true } }).exec();
			observable.emit('change', {
				email: notification[member].email,
				tireType: notification[member].tireType,
				inStock: true,
				quantity: tireArr.quantity,
				filename: 'in-stock'
			});
		}
		if (tireArr.quantity == 0 && notification[member].notifiedInStock == true) {
			let a = await Email.update({ _id: notification[member].id }, { $set: { notifiedInStock: false } }).exec();
			observable.emit('change', {
				email: notification[member].email,
				tireType: notification[member].tireType,
				inStock: false,
				quantity: tireArr.quantity,
				filename: 'out-of-stock'
			});
		}
	}
}
