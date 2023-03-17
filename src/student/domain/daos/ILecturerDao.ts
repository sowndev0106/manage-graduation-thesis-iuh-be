import IDao from '@core/domain/daos/IDao';
import Lecturer, { TypeRoleLecturer } from '@core/domain/entities/Lecturer';
import { injectable } from 'inversify';

export default interface ILecturerDao extends IDao<Lecturer> {
	findByUsername(username: string): Promise<Lecturer | null>;
	findAll(majorsId?: number, termId?: number, role?: TypeRoleLecturer): Promise<Lecturer[]>;
}
