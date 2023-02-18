import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import IUserDao from '@student/domain/daos/IUserDao';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ConflictError from '@core/domain/errors/ConflictError';
import User from '@core/domain/entities/User';
import IMajorsDao from '@student/domain/daos/IMajorsDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import StudentDao from '@student/infrastructure/objection-js/daos/StudentDao';
import Student, { TypeTraining } from '@core/domain/entities/Student';

interface ValidatedInput {
	username: string;
	password: string;
	majorsId: number;
}

@injectable()
export default class RegisterHandlers extends RequestHandler {
	@inject('UserDao') private userDao!: IUserDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
	@inject('StudentDao') private studentDao!: StudentDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const majorsId = this.errorCollector.collect('majorsId', () => EntityId.validate({ value: request.body['majorsId'] }));
		const username = this.errorCollector.collect('username', () => Username.validate({ value: request.body['username'] }));
		const password = this.errorCollector.collect('password', () => Password.validate({ value: request.body['password'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}

		return { username, password, majorsId };
	}

	async handle(request: Request) {
		const input = await this.validate(request);

		let user = await this.userDao.findOneByUsername(input.username);
		if (user) throw new ConflictError('username already exists');

		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		const passwordEncript = await encriptTextBcrypt(input.password);

		const entityUser = User.create({ username: input.username, password: passwordEncript, majorsId: 1 });

		// user = await this.userDao.insertEntity(entityUser);

		// const student = await this.studentDao.insertEntity(
		// 	Student.create({ user: user, schoolYear: new Date().getFullYear().toString(), typeTraining: TypeTraining.University })
		// );
		const student = await this.studentDao.insertGraphEntity(
			Student.create({ user: entityUser, schoolYear: new Date().getFullYear().toString(), typeTraining: TypeTraining.University })
		);

		student.updateUser(entityUser);

		return student.toJSON;
	}
}
