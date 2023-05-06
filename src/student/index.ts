import app from '../app';
import router from './router';
const port = Number(process.env.PORT_STUDENT || 3001);
const baseURL = `${process.env.BASE_URL || 'http://localhost:' + port}`;
app.use(router);
app.listen(port, () => {
	console.log(`Express server STUDENT on ${baseURL}:${port} ` + process.env.NODE_ENV);
});
