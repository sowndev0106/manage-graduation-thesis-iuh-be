import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateOrUpdateTranscriptHandler from '../handlers/transcript/CreateOrUpdateTranscriptHandler';
import GetListTranscriptHandler from '../handlers/transcript/GetListTranscriptHandler';

class TranscriptController {
	async createOrUpdateTranscript(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateOrUpdateTranscriptHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListTranscript(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTranscriptHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new TranscriptController();
