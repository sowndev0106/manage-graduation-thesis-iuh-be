import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import { Request } from 'express';
import SortText from '@core/domain/validate-objects/SortText';
import EntityId from '@core/domain/validate-objects/EntityID';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import Majors from '@core/domain/entities/Majors';

interface ValidatedInput {
	name?: string;
	topicId: number;
	termId: number;
}
@injectable()
export default class CreateGroupHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('GroupDao') private groupDao!: IGroupDao;
	// @inject('TermDao') private termDao!: ITermDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const name = this.errorCollector.collect('name', () => SortText.validate({ value: request.body['name'], required: false }));
		const topicId = this.errorCollector.collect('topicId', () => EntityId.validate({ value: request.body['topicId'] }));
		const termId = this.errorCollector.collect('termId', () => EntityId.validate({ value: request.body['termId'] }));

		return {
			name,
			topicId,
			termId,
		};
	}

	async handle(request: Request) {
		// const input = await this.validate(request);
		// let majors = await this.majorsDao.findEntityById(input.majorsId);
		// if (!majors) throw new NotFoundError('majors not found');
		// let groupsByYear = await this.groupDao.findByYearAndMajors(input.majorsId, input.startDate.getFullYear(), input.endDate.getFullYear());
		// let Group = groupsByYear.find(e => e.name == input.name);
		// if (Group) throw new Error(`name already exists in majors and year ${input.startDate.getFullYear()} - ${input.endDate.getFullYear()}`);
		// Group = await this.groupDao.insertEntity(
		// 	Group.create({
		// 		name: input.name,
		// 		majors: Majors.createById(input.majorsId),
		// 		startDate: input.startDate,
		// 		endDate: input.endDate,
		// 	})
		// );
		// if (!Group) throw new Error('Create Group fail');
		// return Group.toJSON;
	}
}
