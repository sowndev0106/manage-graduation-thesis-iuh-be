import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import app from '../app';
import router from './router';

const port = Number(process.env.PORT_PROXY || 3000);
const portStudent = Number(process.env.PORT_STUDENT || 3001);
const portLecturer = Number(process.env.PORT_LECTURER || 3002);
const baseURL = `${process.env.BASE_URL}:${port}`;
const serverStudent = `${process.env.BASE_URL_STUDENT}:${portStudent}`;
const serverLecturer = `${process.env.BASE_URL_LECTURER}:${portLecturer}`;
console.log({ serverStudent, serverLecturer, baseURL });
const options: Options = {
	target: baseURL, // target host
	changeOrigin: true, // needed for virtual hosted sites
	ws: true,
	pathRewrite: {
		['^/api/student']: '/api', // rewrite path
		['^/api/lecturer']: '/api', // rewrite path
	},
	router: {
		'/api/student': serverStudent,
		'/api/lecturer': serverLecturer,
	},

	// onProxyReqWs: (proxyReq, req, socket) => {
	// 	socket.on('error', function (error) {
	// 		console.warn('Websockets error.', error);
	// 	});
	// },
	onProxyReq: function (proxyReq, req, res, options) {
		if (req.body && req.headers['content-type'] === 'application/x-www-form-urlencoded') {
			let bodyData = JSON.stringify(req.body);
			// incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
			proxyReq.setHeader('Content-Type', 'application/json');
			proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
			// stream the content
			proxyReq.write(bodyData);
		}
	},
};

app.use(router);

const proxy = createProxyMiddleware(options);

app.use('/api', proxy);

app.use('*', (req, res, next) => {
	res.send('url not found: this is server proxy');
});
app.listen(port, () => {
	console.log(`Express server PROXY started on ${baseURL}:${port} ` + process.env.NODE_ENV);
});
