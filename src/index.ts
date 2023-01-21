import 'express-async-errors';
// parse variable environment *** requie first
import "@env/index.js"
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import router from './router';

  
const port = Number(process.env.PORT || 3000)
const baseURL = `${process.env.BASE_URL || "http://localhost:"+port}`
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('trust proxy', 1);

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

app.listen(port, () => {
	console.log(`Express server started on ${baseURL}`);
});
