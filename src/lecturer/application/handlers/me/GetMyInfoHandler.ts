import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { TypeRoleUser } from '@core/domain/entities/User';

interface ValidatedInput {
	id: number;
	role: string;
}

@injectable()
export default class GetMyInfoHandlers extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const data = request.headers;

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		return { id: Number(data.id), role: String(data.role) };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		const lecturer = await this.lecturerDao.findGraphEntityById(input.id, 'user');

		const majors = await this.majorsDao.findGraphEntityById(lecturer!.user.majorsId!, 'head_lecturer');

		const isHeadLecturer = majors?.headLecturerId ? majors.headLecturerId === lecturer?.id : false;

		const { isAdmin, ...props } = lecturer?.toJSON;

		const role = isAdmin ? TypeRoleUser.Admin : isHeadLecturer ? TypeRoleUser.HeadLecturer : TypeRoleUser.Lecturer;

		return { ...props, role };
	}
}
