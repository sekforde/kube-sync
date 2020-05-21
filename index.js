require('dotenv').config();
const { StateSyncer } = require('./StateSyncer');

const main = async () => {
	if (!process.env.LOCATION) {
		console.error('Environment Variable LOCATION is required');
		process.exit(1);
	}

	if (!process.env.BASE_URL) {
		console.error('Environment Variable BASE_URL is required');
		process.exit(1);
	}

	const sync = new StateSyncer(process.env.LOCATION);
	sync.start();
};

main().catch(console.error);
