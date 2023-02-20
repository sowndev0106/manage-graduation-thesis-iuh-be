import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { RoleLecturer } from '@core/domain/entities/Lecturer';
import EntityId from '@core/domain/validate-objects/EntityID';
import SortText from '@core/domain/validate-objects/SortText';
import Email from '@core/domain/validate-objects/Email';
import PhoneNumber from '@core/domain/validate-objects/PhoneNumber';
import Gender from '@core/domain/validate-objects/Gender';

interface ValidatedInput {
	id: number;
	role: string;
}

@injectable()
export default class UpdateMyInfoHandler extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const phoneNumber = this.errorCollector.collect('majors_id', () => PhoneNumber.validate({ value: request.body['majors_id'] }));
		const email = this.errorCollector.collect('majors_id', () => Email.validate({ value: request.body['majors_id'] }));
		const name = this.errorCollector.collect('majors_id', () => SortText.validate({ value: request.body['name'] }));
		const gender = this.errorCollector.collect('majors_id', () => Gender.validate({ value: request.body['majors_id'] }));

		const { role, id } = request.headers;

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		return { id: Number(id), role: String(role) };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const lecturer = await this.lecturerDao.findGraphEntityById(input.id, 'user');

		const majors = await this.majorsDao.findGraphEntityById(lecturer!.user.majorsId!, 'head_lecturer');

		const isHeadLecturer = majors?.headLecturerId ? majors.headLecturerId === lecturer?.id : false;

		const { isAdmin, ...props } = lecturer?.toJSON;

		const role = isAdmin ? RoleLecturer.Admin : isHeadLecturer ? RoleLecturer.headLecturer : RoleLecturer.Lecturer;

		return { ...props, role };
	}
}
