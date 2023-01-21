import fs from 'fs-extra';
import { WriteStream } from 'fs-extra';
import { finished } from 'stream';
import { promisify } from 'util';

export interface ICsvExportConfig {
	path: string;
	filePath: string;
	fields: string[];
}

export default class CsvExporter {
	private _configs: ICsvExportConfig;
	private _writeStream!: WriteStream;

	constructor(configs: ICsvExportConfig) {
		this._configs = configs;
	}

	start() {
		const { path, filePath, fields } = this._configs;

		if (!fs.pathExistsSync(path)) fs.mkdirSync(path, { recursive: true });

		fs.ensureFileSync(filePath);
		this._writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8' });

		if (fields && fields.length > 0) {
			const headerRow = fields.join(',') + '\n';
			this._writeStream.write(headerRow);
		}
	}

	writeRow(data: object) {
		const row = this.generateRow(data);
		this._writeStream.write(row);
	}

	end() {
		this._writeStream.close();
		this._writeStream.end();
	}

	async finish() {
		await promisify(finished)(this._writeStream);
	}

	private generateRow(data: any) {
		const fields = this._configs.fields;

		let row = '';

		for (const field of fields) {
			row += `"${this.format(data[field])}"` + ',';
		}

		row += '\n';

		return row;
	}

	private format(value: any) {
		if (value && value instanceof Date) return value.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
		else if ((value && value instanceof Boolean) || typeof value === 'boolean') return value ? '1' : '0';
		else if (value) return value;
		else return '';
	}
}
