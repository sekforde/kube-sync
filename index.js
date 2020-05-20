require('dotenv').config();
const { StateSyncer } = require('./StateSyncer');

const main = async () => {
	const sync = new StateSyncer('nigel-home');
	sync.start();
};

main().catch(console.error);
