import StudentTerm from '@core/domain/entities/StudentTerm';
import StudentTermDaoCore from '@core/infrastructure/objection-js/daos/StudentTermDao';
import IStudentTermDao from '@student/domain/daos/IStudentTermDao';
import { injectable } from 'inversify';

@injectable()
export default class StudentTermDao extends StudentTermDaoCore implements IStudentTermDao {}
