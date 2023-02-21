import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IUserDao from '@student/domain/daos/IUserDao';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { RoleLecturer } from '@core/domain/entities/Lecturer';

interface ValidatedInput {
	id: number;
	role: string;
}

@injectable()
export default class GetListHeadLecturerHandler extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
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

		const lecturers = await this.lecturerDao.getListHeadLecturer();

		// const majors = await this.majorsDao.findGraphEntityById(lecturer!.user.majorsId!, 'head_lecturer');

		// const isHeadLecturer = majors?.headLecturerId ? majors.headLecturerId === lecturer?.id : false;

		// const { isAdmin, ...props } = lecturer?.toJSON;

		// const role = isAdmin ? RoleLecturer.Admin : isHeadLecturer ? RoleLecturer.headLecturer : RoleLecturer.Lecturer;
		return lecturers?.map(e => e.toJSON);
	}
}
