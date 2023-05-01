import IDao from '@core/domain/daos/IDao';
import StudentTerm from '@core/domain/entities/StudentTerm';

export default interface IStudentTermDao extends IDao<StudentTerm> {
	findOne(termId: number, studentId: number): Promise<null | StudentTerm>;
	findOneGraphById(id: number): Promise<null | StudentTerm>;
}
