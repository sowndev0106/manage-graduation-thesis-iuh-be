import IDao from '@core/domain/daos/IDao';
import LecturerTerm from '@core/domain/entities/LecturerTerm';

export default interface ILecturerTermDao extends IDao<LecturerTerm> {
	findOne(termId: number, lecturerId: number): Promise<null | LecturerTerm>;
}
