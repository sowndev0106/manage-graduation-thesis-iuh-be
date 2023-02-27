import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateTopicHandler from '../handlers/topic/CreateTopicHandler';
import UpdateTopicHandler from '../handlers/topic/UpdateTopicHandler';
import GetListTopicHandler from '../handlers/topic/GetListTopicHandler';
import GetTopicByIdHandler from '../handlers/topic/GetTopicByIdHandler';
import DeleteTopicHandler from '../handlers/topic/DeleteTopicHandler';
import UpdateStatusAndCommentTopicHandler from '../handlers/topic/UpdateStatusAndCommentTopicHandler';

class TopicController {
	async createTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateTopicHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateTopicHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTopicHandler).handle(req);
		return res.status(200).json(data);
	}
	async getTopicById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetTopicByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteTopicHandler).handle(req);
		return res.status(200).json(data);
	}
	async reviewTopic(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateStatusAndCommentTopicHandler).handle(req);
		return res.status(200).json(data);
	}
}
export default new TopicController();
