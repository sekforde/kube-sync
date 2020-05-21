require('dotenv').config();
const { StateSyncer } = require('./StateSyncer');

const main = async () => {
	if (!process.env.LOCATION) {
		console.error('Environment Variable LOCATION is required');
		process.exit(1);
	}
	const sync = new StateSyncer(pro);
	sync.start();
};

main().catch(console.error);
