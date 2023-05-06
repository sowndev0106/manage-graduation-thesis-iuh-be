import app from '../app';
import router from './router';
const port = Number(process.env.PORT_LECTURER || 3002);
const baseURL = `${process.env.BASE_URL || 'http://localhost:' + port}`;

app.use(router);

app.listen(port, () => {
	console.log(`Express server LECTURER started on ${baseURL}:${port} ` + process.env.NODE_ENV);
});
