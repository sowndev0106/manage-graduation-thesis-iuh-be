import IDao from '@core/domain/daos/IDao';
import Lecturer from '@core/domain/entities/Lecturer';
import { injectable } from 'inversify';

export default interface ILecturerDao extends IDao<Lecturer> {
	findByUsername(username: string): Promise<Lecturer | null>;
	findAll(majorsId?: number, isHeadLecturer?: boolean): Promise<Lecturer[]>;
}
