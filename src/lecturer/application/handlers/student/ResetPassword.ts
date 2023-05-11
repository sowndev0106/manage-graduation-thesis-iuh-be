import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import Password from '@core/domain/validate-objects/Password';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Student from '@core/domain/entities/Student';
import Lecturer from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ForbiddenError from '@core/domain/errors/ForbiddenError';
import ErrorCode from '@core/domain/errors/ErrorCode';

interface ValidatedInput {
	me: Lecturer;
	student: Student;
	password: string;
}

@injectable()
export default class ResetPassword extends RequestHandler {
	@inject('StudentDao') private studentDao!: IStudentDao;
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const studentId = this.errorCollector.collect('studentId', () => EntityId.validate({ value: request.params['studentId'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		let student = await this.studentDao.findEntityById(studentId);
		if (!student) throw new NotFoundError('student not found');

		let me = await this.lecturerDao.findEntityById(Number(request.headers['id']));
		if (!me) throw new ForbiddenError('Error! please login again');
		return {
			me,
			password,
			student,
		};
	}

	async handle(request: Request) {
		const input = await this.validate(request);
		if (!input.me.isAdmin && input.me.majorsId != input.student.majorsId) {
			throw new ErrorCode('DONT_HAVE_PERMISSION_THIS_MAJORS', `You don\'t have permission to student with majors ${input.student.majorsId}`);
		}
		const newPassword = await encriptTextBcrypt(input.password);

		input.student?.update({ password: newPassword });

		input.student = await this.studentDao.updateEntity(input.student);

		return input.student?.toJSON;
	}
}
