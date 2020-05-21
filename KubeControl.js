const { spawn } = require('child_process');
const fse = require('fs-extra');
const tmp = require('tmp');

const folder = process.env.YAML_FOLDER || '/tmp';

const execute = (filename) => {
	return new Promise((resolve, reject) => {
		const kubectl = spawn('kubectl', ['apply', '-f', filename]);
		kubectl.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		kubectl.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});
		kubectl.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			resolve();
		});
	});
}

exports.KubeControl = class {
	static async apply(yaml) {
		try {
			const filename = tmp.tmpNameSync({ tmpdir: `${folder}`, postfix: '.yaml' });

			console.log('writing to ', filename);
			console.log(yaml);

			await fse.writeFile(filename, yaml, { encoding: 'utf8' });

			await execute(filename).catch(console.error);

		} catch (err) {
			console.error(err);
		}
	}
}