import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.SALT_NUMBER) || 10;

async function encriptTextBcrypt(text: string) {
	const result = await bcrypt.hash(text, saltRounds);
	return result;
}

async function compareTextBcrypt(text: string, textEncript: string) {
	return bcrypt.compare(text, textEncript);
}

export { encriptTextBcrypt, compareTextBcrypt };
