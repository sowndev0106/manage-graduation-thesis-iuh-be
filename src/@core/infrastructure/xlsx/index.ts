import XLSX from 'xlsx';

// Convert the worksheet to a JSON object

function converExcelBufferToObject(file: Buffer) {
	const workbook = XLSX.read(file, { type: 'buffer' });
	const sheetNames = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetNames];
	const data: any = XLSX.utils.sheet_to_json(worksheet);
	return data;
}

export { converExcelBufferToObject };
