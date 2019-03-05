const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const credentials = require('../../emailCreds.json');

if (credentials.type === "sendgrid") {
	sgMail.setApiKey(credentials.apiKey);
	exports.send = function(email) {
		sgMail.send(email);
	}
} else if (credentials.type === "smtp") {
	const transporter = nodemailer.createTransport(credentials.credentials);
	exports.send = function(email) {
		transporter.sendMail(email);
	}
} else {
	console.log("Invalid email type: " + credentials.type);
}
