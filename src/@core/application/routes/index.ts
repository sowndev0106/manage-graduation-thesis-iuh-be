import logger from '@core/infrastructure/logger/Logger';
import { Router } from 'express';
import ErrorHandler from '@core/application/middlewares/errorHandlerMiddlewares';

const router = Router();
router.get('/logs', (req, res) => {
	const { from, until, limit } = req.query as any;
	const option = {
		from: from && new Date(from),
		until: until && new Date(until),
		start: 0,
		limit: limit && Number(limit),
		fields: ['message', 'level', 'timestamp'],
		order: 'desc' as any,
	};
	logger.query(option, (err: any, result: any) => {
		if (err) {
			return res.status(500).send('error');
		}
		res.send(result);
	});
});

router.use(ErrorHandler);

export default router;
