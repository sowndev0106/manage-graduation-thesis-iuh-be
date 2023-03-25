import IDao from '@core/domain/daos/IDao';
import Student from '@core/domain/entities/Student';
import { injectable } from 'inversify';

export default interface IStudentDao extends IDao<Student> {
	findByUsername(username: string): Promise<Student | null>;
	findAll(termId?: number, groupExists?: boolean): Promise<Student[]>;
}
