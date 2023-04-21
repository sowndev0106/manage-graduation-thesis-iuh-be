import 'express-async-errors';
// parse variable environment *** requie first
import './env';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import router from './router';
// connect database
import '@core/infrastructure/objection-js';
// connect redis
import '@core/infrastructure/redis';
import path from 'path';

const port = Number(process.env.PORT || 3000);
const baseURL = `${process.env.BASE_URL || 'http://localhost:' + port}`;
const app = express();

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
console.log(process.env);
app.use(router);

// Start the server

app.listen(port, () => {
	console.log(`Express server started on ${baseURL} ` + process.env.NODE_ENV);
});
