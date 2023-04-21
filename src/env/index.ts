import fs from 'fs-extra';
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'develop';

let envFileDir = `./env/${process.env.NODE_ENV}.env`;

if (fs.existsSync(envFileDir) === false) {
	envFileDir = `./../../../../../env/${process.env.NODE_ENV}.env`;
}
const envConfigs = dotenv.parse(fs.readFileSync(envFileDir));
const envVariables: any = {};

for (const key in envConfigs) {
	let value = envConfigs[key];

	const regexPatten = /\$\{([A-Z0-9\_]+)\}/g;

	const matches = value.match(regexPatten);

	if (matches) {
		for (const match of matches) {
			const refKey = match.substr(2, match.length - 3).trim();
			value = value.replace(match, envConfigs[refKey]);
		}
	}

	envVariables[key] = value;
}

for (const key of Object.keys(envVariables)) {
	if (process.env[key] === undefined) process.env[key] = envVariables[key];
}
