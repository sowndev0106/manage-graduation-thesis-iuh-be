export default class TextRenderer {
	private static readonly VARIABLE_PATTERN = /\[\:([a-z][a-z0-9_]+)\]/gm;

	render(template: string, data: { [key: string]: string | number | boolean }): string {
		const content = template.replace(TextRenderer.VARIABLE_PATTERN, match => {
			const key = match.substring(2, match.length - 1);
			return (data[key] && data[key].toString()) || '';
		});

		return content;
	}
}
