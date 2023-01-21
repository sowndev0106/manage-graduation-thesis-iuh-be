/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const fs = require('fs-extra');
const childProcess = require('child_process');

const copiedFiles = {
	'./src/infrastructure/ldap/certs/certificate.pem': './dist/infrastructure/ldap/certs/certificate.pem',
	'./src/infrastructure/ldap/certs/privatekey.pem': './dist/infrastructure/ldap/certs/privatekey.pem',
};

try {
	fs.removeSync('./dist/');

	for (const srcFilename in copiedFiles) {
		const destFilename = copiedFiles[srcFilename];

		if (fs.existsSync(srcFilename)) {
			const destPath = destFilename.substring(0, destFilename.lastIndexOf('/'));

			if (fs.pathExistsSync(destPath) === false) fs.mkdirSync(destPath, { recursive: true });

			fs.copyFileSync(srcFilename, destFilename);
		}
	}

	console.log('Typescript Version: ', childProcess.execSync('tsc -v').toString());
	childProcess.execSync('tsc --build tsconfig.prod.json');

	console.log('BUILD SUCCESSFUL', new Date());
} catch (err) {
	console.log('BUILD ERROR', new Date());
	console.log('-----------');
	console.log(err.stdout.toString());

	throw new Error(err.message);
}
