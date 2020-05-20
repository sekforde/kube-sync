const { exec } = require('child_process');
const fse = require('fs-extra');
const tmp = require('tmp-promise');

exports.KubeControl = class {
	static async apply(yaml) {
		const o = await tmp.file();
		console.log('writing to ', o.path);
		await fse.writeFileSync(o.path, yaml);
		const cmd = `kubectl -f apply ${o.path}`;
		console.log(cmd);
	}
}