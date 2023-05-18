import { inject, injectable } from 'inversify';
import RequestHandler from '@core/application/RequestHandler';
import ValidationError from '@core/domain/errors/ValidationError';
import { Request } from 'express';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import EntityId from '@core/domain/validate-objects/EntityID';
import BooleanValidate from '@core/domain/validate-objects/BooleanValidate';
import RoleLecturer from '@core/domain/validate-objects/RoleLecturer';
import Lecturer, { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import NotFoundError from '@core/domain/errors/NotFoundError';
import NotificationLecturerService from '@core/service/NotificationLecturerService';

interface ValidatedInput {
	lecturer: Lecturer;
	role: TypeRoleLecturer;
}

@injectable()
export default class ChangeRoleLecturer extends RequestHandler {
	@inject('LecturerDao') private lecturerDao!: ILecturerDao;
	async validate(request: Request): Promise<ValidatedInput> {
		const id = this.errorCollector.collect('id', () => EntityId.validate({ value: request.params['id'] }));
		const role = this.errorCollector.collect('role', () => RoleLecturer.validate({ value: request.body['role'] }));

		if (this.errorCollector.hasError()) {
			throw new ValidationError(this.errorCollector.errors);
		}
		const lecturer = await this.lecturerDao.findEntityById(id);

		if (!lecturer) {
			throw new NotFoundError('lecturer not found');
		}
		return { lecturer, role };
	}

	async handle(request: Request) {
		const { lecturer, role } = await this.validate(request);
		if (lecturer.role == role) {
			return lecturer.toJSON;
		}
		if (role == TypeRoleLecturer.SUB_HEAD_LECTURER || role == TypeRoleLecturer.HEAD_LECTURER) {
			await this.destroyOldLecturer(lecturer, role);
		}
		lecturer.update({ role });

		const lecturerUpdated = await this.lecturerDao.updateEntity(lecturer);
		const roleMessage =
			role == TypeRoleLecturer.HEAD_LECTURER ? "'Chủ nhiệm ngành'" : role == TypeRoleLecturer.SUB_HEAD_LECTURER ? "'Phó chủ nhiệm ngành'" : 'Giảng viên';

		await NotificationLecturerService.send({
			user: lecturer!,
			message: `Bạn vừa được đổi quyền người dùng thành ${roleMessage}`,
			type: 'LECTURER',
		});

		return lecturerUpdated?.toJSON || {};
	}
	private async destroyOldLecturer(lecturer: Lecturer, role: TypeRoleLecturer) {
		const oldLecturerByRole = await this.lecturerDao.findOneByRole(lecturer.majorsId!, role);
		if (oldLecturerByRole) {
			oldLecturerByRole.update({ role: TypeRoleLecturer.LECTURER });
			// update old lecturer
			await this.lecturerDao.updateEntity(oldLecturerByRole);

			await NotificationLecturerService.send({
				user: lecturer!,
				message: `Bạn vừa được đổi quyền người dùng thành 'Giảng viên'`,
				type: 'LECTURER',
			});
		}
	}
}
