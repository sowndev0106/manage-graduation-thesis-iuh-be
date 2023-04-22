import { NextFunction, Request, Response } from 'express';
import Ioc from '@student/infrastructure/inversify';
import GetAVGTranscriptHandler from '../handlers/transcript/GetAVGTranscriptHandler';

class TranscriptController {
	async getAVGTranscriptByStudent(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetAVGTranscriptHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new TranscriptController();
