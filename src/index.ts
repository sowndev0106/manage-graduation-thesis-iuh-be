import 'express-async-errors';
// parse variable environment *** requie first
import './env';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import path from 'path';
// import socket from '@core/infrastructure/socket';
import router from './router';
import ServerSocket from '@core/infrastructure/socket';

// connect database
import '@core/infrastructure/objection-js';
// connect redis
import '@core/infrastructure/redis';

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT || 3000);
const baseURL = `${process.env.BASE_URL || 'http://localhost:' + port}`;

// init socket
new ServerSocket(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('trust proxy', 1);

app.set('views', path.join(__dirname, '/@core/infrastructure/ejs/views'));
app.set('view engine', 'ejs');

// Show routes called in console during development
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Security
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

app.use(router);

// Start the server

server.listen(port, () => {
	console.log(`Express server started on ${baseURL} ` + process.env.NODE_ENV);
});
