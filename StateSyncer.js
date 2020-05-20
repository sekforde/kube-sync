const { Poller } = require('./Poller');
const { KubeControl } = require('./KubeControl');

exports.StateSyncer = class {
	constructor(location) {
		this.state = {}
		this.location = location;
		this.poller = new Poller(this.location);
		this.poller.on('new-config', data => this.sync(data));
	}
	start() {
		this.poller.start();
	}
	sync(data) {
		const { hash } = data;
		if (hash !== this.state.hash) {
			console.log('new config found:', hash);
			this.poller.pause();
			this.state = data;
			this.process();
		}
	}
	async process() {
		console.log('processing new config:', this.state.hash);
		await KubeControl.apply(this.state.yaml);
		setTimeout(() => {
			this.finished();
		}, 10000);
	}
	finished() {
		console.log('finished processing:', this.state.hash);
		this.poller.unpause();
	}
}
