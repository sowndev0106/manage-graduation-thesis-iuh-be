import Student from '@core/domain/entities/Student';
import StudentDaoCore from '@core/infrastructure/objection-js/daos/StudentDao';
import IStudentDao from '@student/domain/daos/IStudentDao';
import StudentModel from '@core/infrastructure/objection-js/models/Student';
import { injectable } from 'inversify';

@injectable()
export default class StudentDao extends StudentDaoCore implements IStudentDao {}
