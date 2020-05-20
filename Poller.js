const { EventEmitter } = require('events');
const axios = require('axios');

const baseUrl = process.env.BASE_URL;

exports.Poller = class extends EventEmitter {
	constructor(location) {
		super();
		this.location = location;
		console.log('polling location:', this.location);
		this.refresh = 1000;
		this.running = true;
	}
	async _get() {
		try {
			const url = `${baseUrl}/location/${this.location}/pods`;
			const response = await axios.get(url);
			const { data } = response;
			this.emit('new-config', data);
		} catch (err) {
			console.error(err);
		}
	}
	start() {
		if (this.running) {
			this._get();
		}
		setTimeout(() => {
			this.start();
		}, this.refresh);
	}
	unpause() {
		console.log('running');
		this.running = true;
	}
	pause() {
		console.log('paused');
		this.running = false;
	}
}
