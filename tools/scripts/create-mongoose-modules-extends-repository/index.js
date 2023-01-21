const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const replaceInFile = require('replace-in-file');

const WORK_DIR = './tools/scripts/create-mongoose-modules-extends-repository';

const TEMPLATES_PATHS = {
	IRepository: `${WORK_DIR}/templates/domain/repositories/IRepository.ts.tmpl`,
	Repository: `${WORK_DIR}/templates/infrastructure/repositories/Repository.tmpl`,
};

function main(argv) {
	const { module, repository } = validate(argv);

	const repository_name = repository.charAt(0).toLocaleUpperCase() + repository.slice(1);

	const destBaseDir = `./src/modules/${module}`;

	const destPaths = {
		IRepository: `${destBaseDir}/domain/repositories/I${repository_name}Repository.ts`,
		Repository: `${destBaseDir}/infrastructure/repositories/${repository_name}Repository.ts`,
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

	const replaceTextPaths = {
		...destPaths,
		inversify: `${destBaseDir}/infrastructure/inversify/index.ts`,
	};

	const importText = `import ${repository_name}Repository from '../repositories/${repository_name}Repository';
  import I${repository_name}Repository from '@modules/api/domain/repositories/I${repository_name}Repository';
  // [:import]
  `;

	const bindText = `container.bind<I${repository_name}Repository>('${repository_name}Repository').to(${repository_name}Repository);
  // [:bind]
  `;

	try {
		const result = replaceInFile.replaceInFileSync({
			files: Object.values(replaceTextPaths),
			from: [/\[\:repository\_name\]/g, /\[\:module\_name\]/g, /\/\/ \[\:import\]/g, /\/\/ \[\:bind\]/g],
			to: [repository_name, module, importText, bindText],
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
