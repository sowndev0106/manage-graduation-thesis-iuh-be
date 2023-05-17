import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import app from './app';
import routerCore from './@core/router';
import routerLecturer from './lecturer/router';
import routerStudent from './student/router';

const port = Number(process.env.PORT_PROXY || 3000);
const baseURL = `${process.env.BASE_URL}:${port}`;
const options: Options = {
	target: baseURL, // target host
	changeOrigin: true, // needed for virtual hosted sites
	ws: true,
	pathRewrite: {
		['^/api/student']: '/student/api', // rewrite path
		['^/api/lecturer']: '/lecturer/api', // rewrite path
	},
	router: {
		'/api/student': baseURL,
		'/api/lecturer': baseURL,
	},
	onProxyReq: function (proxyReq, req, res, options) {
		if (req.body && !req.headers['content-type']?.startsWith('multipart/form-data')) {
			let bodyData = JSON.stringify(req.body);
			// incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
			proxyReq.setHeader('Content-Type', 'application/json');
			proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
			// stream the content
			proxyReq.write(bodyData);
		}
	},
};
const proxy = createProxyMiddleware(options);

app.use('/api', proxy);

app.use('/lecturer', routerLecturer);
app.use('/student', routerStudent);
app.use(routerCore);
app.use('*', (req, res, next) => {
	res.send('url not found: this is server proxy');
});
app.listen(port, () => {
	console.log(`Express server PROXY started on ${baseURL}:${port} ` + process.env.NODE_ENV);
});
