import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import Username from '@core/domain/validate-objects/Username';
import Password from '@core/domain/validate-objects/Password';
import NotFoundError from '@core/domain/errors/NotFoundError';
import ConflictError from '@core/domain/errors/ConflictError';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import { encriptTextBcrypt } from '@core/infrastructure/bcrypt';
import Lecturer, { TypeDegree, TypeGender, TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import { faker } from '@faker-js/faker';
import Majors from '@core/domain/entities/Majors';

interface ValidatedInput {
	username: string;
	password: string;
	majorsId: number;
}

@injectable()
export default class RegisterHandlers extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	@inject('MajorsDao') private majorsDao!: IMajorsDao;
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

		let lecturer = await this.lecturerDao.findByUsername(input.username);
		if (lecturer) throw new ConflictError('username already exists');

		let majors = await this.majorsDao.findEntityById(input.majorsId);
		if (!majors) throw new NotFoundError('majors not found');

		const passwordEncript = await encriptTextBcrypt(input.password);

		lecturer = Lecturer.create({
			username: input.username,
			password: passwordEncript,
			majors: Majors.createById(1),
			avatar: faker.image.avatar(),
			email: `${input.username}@gmail.com`,
			gender: TypeGender.FEMALE,
			name: faker.name.fullName(),
			phoneNumber: faker.phone.number(),
			degree: TypeDegree.MASTERS,
			isAdmin: false,
			role: TypeRoleLecturer.LECTURER,
		});

		lecturer = await this.lecturerDao.insertEntity(lecturer);

		return lecturer.toJSON;
	}
}
