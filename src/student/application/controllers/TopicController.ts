import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetListTopicHandler from '../handlers/topic/GetListTopicHandler';
import GetTopicByIdHandler from '../handlers/topic/GetTopicByIdHandler';

class TopicController {
	async getListTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTopicHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTopicById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTopicByIdHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new TopicController();
