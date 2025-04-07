const util = require('util');
const exec = util.promisify(require('child_process').exec);

const autodeploy = async () => {
	let response = null,
		message = '';

	try {
		await exec(`git add --all && git commit -am "Autodeploy commit."`);
	}
	catch (err) {
	}
	try {
		response = await exec(`git pull`);
		message = (response || {}).stdout || (response || {}).stderr;
	}
	catch (err) {
	}
	try {
		if (message !== 'Already up to date.' 
			&& (message.indexOf('Merge made by') === 0
				|| message.indexOf('Updating') === 0
				|| message.includes('Fast-forward'))) {
			await exec(`npm run build`);
			await exec(`pm2 delete all`);
			await exec(`pm2 start npm --name monitor-front -- run start -- -p 3000`);
		}
	}
	catch (err) {
	}
	return process.exit();
};

autodeploy();

