import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateEvaluationHandler from '../handlers/evaluation/CreateEvaluationHandler';
import UpdateEvaluationHandler from '../handlers/evaluation/UpdateEvaluationHandler';
import GetListEvaluationHandler from '../handlers/evaluation/GetListEvaluationHandler';
import GetEvaluationByIdHandler from '../handlers/evaluation/GetEvaluationByIdHandler';
import DeleteEvaluationHandler from '../handlers/evaluation/DeleteEvaluationHandler';
import CreateEvaluationDetailHandler from '../handlers/evaluation/evaluation-detail/CreateEvaluationDetailHandler';
import UpdateEvaluationDetailHandler from '../handlers/evaluation/evaluation-detail/UpdateEvaluationHandler';
import GetListEvaluationDetailHandler from '../handlers/evaluation/evaluation-detail/GetListEvaluationDetailHandler';
import GetEvaluationDetailByIdHandler from '../handlers/evaluation/evaluation-detail/GetEvaluationByIdHandler';
import DeleteEvaluationDetailHandler from '../handlers/evaluation/evaluation-detail/DeleteEvaluationDetailHandler';

class EvaluationDetailController {
	async createEvaluation(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateEvaluationHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateEvaluation(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateEvaluationHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListEvaluation(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListEvaluationHandler).handle(req);
		return res.status(200).json(data);
	}

	// details
	async getEvaluationById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetEvaluationByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteEvaluation(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteEvaluationHandler).handle(req);
		return res.status(200).json(data);
	}
	async createEvaluationDetail(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateEvaluationDetailHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateEvaluationDetail(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateEvaluationDetailHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListEvaluationDetail(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListEvaluationDetailHandler).handle(req);
		return res.status(200).json(data);
	}
	async getEvaluationDetailById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetEvaluationDetailByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteEvaluationDetail(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteEvaluationDetailHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new EvaluationDetailController();
