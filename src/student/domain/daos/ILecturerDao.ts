import IDao from '@core/domain/daos/IDao';
import Lecturer from '@core/domain/entities/Lecturer';
import { injectable } from 'inversify';

export default interface ILecturerDao extends IDao<Lecturer> {
	findAll(majorsId?: number, isHeadLecturer?: boolean): Promise<Lecturer[]>;
}
