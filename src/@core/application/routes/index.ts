import logger from '@core/infrastructure/logger';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import ErrorHandler from '@core/application/middlewares/errorHandlerMiddlewares';
import swaggerDocument from '@core/infrastructure/swagger/swagger.json';

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

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(ErrorHandler);

export default router;
