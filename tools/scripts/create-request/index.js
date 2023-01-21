const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const replaceInFile = require('replace-in-file');

const WORK_DIR = './tools/scripts/create-request';

const TEMPLATES_PATHS = {
	request: `${WORK_DIR}/templates/Request.ts.tmpl`,
	response: `${WORK_DIR}/templates/Response.ts.tmpl`,
	handler: `${WORK_DIR}/templates/Handler.ts.tmpl`,
};

function main(argv) {
	const { module, request, subPath } = validate(argv);

	const destBaseDir = `./src/modules/${module}`;

	const destPaths = {
		request: `${destBaseDir}/presentation/requests${subPath}/${request}.ts`,
		response: `${destBaseDir}/presentation/responses${subPath}/${request}.ts`,
		handler: `${destBaseDir}/application/handlers${subPath}/${request}.ts`,
	};

	for (const key of Object.keys(TEMPLATES_PATHS)) {
		const srcFilename = TEMPLATES_PATHS[key];
		const destFilename = destPaths[key];

		const destDir = destPaths[key].substring(0, destFilename.lastIndexOf('/'));

		if (fs.pathExistsSync(destFilename) === true) {
			fs.unlinkSync(destFilename);
		}

		if (fs.pathExistsSync(destDir) === false) {
			fs.mkdirSync(destDir, { recursive: true });
		}

		fs.copyFileSync(srcFilename, destFilename);
	}

	try {
		const result = replaceInFile.replaceInFileSync({
			files: Object.values(destPaths),
			from: [/\[\:request\_name\]/g, /\[\:module\_name\]/g, /\[\:sub\_path\]/g],
			to: [request, module, subPath],
			countMatches: true,
		});

		console.log(result);
	} catch (err) {
		console.log(err);
		for (const dir of destPaths) {
			fs.removeSync(dir);
		}
		throw err;
	}
}

function validate(argv) {
	const { module, request, subPath } = argv;

	if (module == undefined || module == null || !!module == false || typeof module != 'string') {
		throw new Error('--module is empty or missing');
	}

	if (request == undefined || request == null || !!request == false || typeof request != 'string') {
		throw new Error('--request is empty or missing');
	}

	if (subPath != undefined && subPath != null && subPath.trim() != '' && !subPath.match(/^/)) {
		throw new Error('--sub-path is invalid');
	}

	return {
		module: module,
		request: request,
		subPath: (subPath && subPath.trim()) || '',
	};
}

main(yargs(hideBin(process.argv)).argv);
