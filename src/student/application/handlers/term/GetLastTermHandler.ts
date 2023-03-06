import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import EntityId from '@core/domain/validate-objects/EntityID';
import ITermDao from '@student/domain/daos/ITermDao';

interface ValidatedInput {
	majorsId: number;
}

@injectable()
export default class GetLastTermHandler extends RequestHandler {
	@inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.query['majorsId'] }));

		return { majorsId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const term = await this.termDao.findLastTermByMajors(input.majorsId);
		const dateNow = new Date();
		if (!term || dateNow > term.endDate) {
			return null;
		}

		return term.toJSON;
	}
}
