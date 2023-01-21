const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const replaceInFile = require('replace-in-file');

const WORK_DIR = './tools/scripts/create-mongoose-core-repository';

const TEMPLATES_PATHS = {
	Entity: `${WORK_DIR}/templates/core/domain/entities/Entity.ts.tmpl`,
	IRepository: `${WORK_DIR}/templates/core/domain/repositories/IRepository.ts.tmpl`,
	Model: `${WORK_DIR}/templates/core/infrastructure/mongoose/models/Model.ts.tmpl`,
	Repository: `${WORK_DIR}/templates/core/infrastructure/mongoose/repositories/Repository.ts.tmpl`,
};

function main(argv) {
	const { module, repository } = validate(argv);

	const repository_name = repository.charAt(0).toLocaleUpperCase() + repository.slice(1);

	const lowerchase_first_character_repository_name = repository_name.charAt(0).toLocaleLowerCase() + repository_name.slice(1);

	const destBaseDir = `./src/modules/${module}`;

	const destPaths = {
		Entity: `${destBaseDir}/domain/entities/${repository_name}.ts`,
		IRepository: `${destBaseDir}/domain/repositories/I${repository_name}Repository.ts`,
		Model: `${destBaseDir}/infrastructure/mongoose/models/${repository_name}.ts`,
		Repository: `${destBaseDir}/infrastructure/mongoose/repositories/${repository_name}Repository.ts`,
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
			from: [/\[\:repository\_name\]/g, /\[\:first\_char\_lowercase\_repository\_name\]/g],
			to: [repository_name, lowerchase_first_character_repository_name],
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
	console.log(argv);
	const { module, repository } = argv;

	if (module == undefined || module == null || !!module == false || typeof module != 'string') {
		throw new Error('--module is empty or missing');
	}

	if (repository == undefined || repository == null || !!repository == false || typeof repository != 'string') {
		throw new Error('--repository is empty or missing');
	}

	const processRequest = repository.split('/');
	let newRequest = null;
	let newSubPath = null;
	if (processRequest.length > 1) {
		newRequest = processRequest[processRequest.length - 1];
		processRequest.pop();
		newSubPath = processRequest.join('/');
	}

	return {
		module: module,
		repository: (newRequest && newRequest) || repository,
	};
}

main(yargs(hideBin(process.argv)).argv);
