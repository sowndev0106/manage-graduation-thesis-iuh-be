import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import ILecturerDao from '@student/domain/daos/ILecturerDao';

interface ValidatedInput {}

@injectable()
export default class GetListTermHandler extends RequestHandler {
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return {};
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const listMajors = await this.majorsDao.getAllEntities();

		const majorsHeadLecturerPromise = listMajors.map(async e => {
			const headLecturer = await this.lecturerDao.findOneByRole(e.id!, TypeRoleLecturer.HEAD_LECTURER);
			const subHeadLecturer = await this.lecturerDao.findOneByRole(e.id!, TypeRoleLecturer.SUB_HEAD_LECTURER);
			return {
				...e.toJSON,
				headLecturer: headLecturer?.toJSON,
				subHeadLecturer: subHeadLecturer?.toJSON,
			};
		});
		const result = await Promise.all(majorsHeadLecturerPromise);

		return result;
	}
}
