const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// Connect to  Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

require('./models/Email');
require('./models/Tire');

const app = require('./app');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', './views');
const server = app.listen(app.get('port'), () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
