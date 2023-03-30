import { NextFunction, Request, Response } from 'express';
import Ioc from '@lecturer/infrastructure/inversify';
import CreateGroupLecturerHandler from '../handlers/group-lecturer/CreateGroupLecturerHandler';
import UpdateGroupLecturerHandler from '../handlers/group-lecturer/UpdateGroupLecturerHandler';
import GetListGroupLecturerHandler from '../handlers/group-lecturer/GetListGroupLecturerHandler';
import GetGroupLecturerByIdHandler from '../handlers/group-lecturer/GetGroupLecturerByIdHandler';
import DeleteGroupLecturerHandler from '../handlers/group-lecturer/DeleteGroupLecturerHandler';
import DeleteGroupLecturerMemberHandler from '../handlers/group-lecturer/members/DeleteGroupLecturerMemberHandler';
import CreateGroupLecturerMemberHandler from '../handlers/group-lecturer/members/CreateGroupLecturerMemberHandler';

class GroupLecturerController {
	async createGroupLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateGroupLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async updateGroupLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(UpdateGroupLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async getListGroupLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetListGroupLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async getGroupLecturerById(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(GetGroupLecturerByIdHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteGroupLecturer(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteGroupLecturerHandler).handle(req);
		return res.status(200).json(data);
	}
	async addMember(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(CreateGroupLecturerMemberHandler).handle(req);
		return res.status(200).json(data);
	}
	async deleteMember(req: Request, res: Response, next: NextFunction) {
		const data = await Ioc.get(DeleteGroupLecturerMemberHandler).handle(req);
		return res.status(200).json(data);
	}
}

export default new GroupLecturerController();
