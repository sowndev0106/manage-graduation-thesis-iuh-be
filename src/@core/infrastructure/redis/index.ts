import * as redis from 'redis';
const client = redis.createClient({ url: process.env.REDIS_URL });

client
	.connect()
	.then(() => console.log('redis connected successfully'))
	.catch((err: any) => console.log(err));

export default client;
