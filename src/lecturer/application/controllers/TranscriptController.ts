import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateOrUpdateTranscriptHandler from '../handlers/transcript/CreateOrUpdateTranscriptHandler';
import GetListTranscriptByStudentHandler from '../handlers/transcript/GetListTranscriptByStudentHandler';
import GetListTranscriptByGroupHandler from '../handlers/transcript/GetListTranscriptByGroupHandler';

class TranscriptController {
	async createOrUpdateTranscript(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateOrUpdateTranscriptHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListTranscriptByGroup(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTranscriptByGroupHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListTranscriptByStudent(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListTranscriptByStudentHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new TranscriptController();
