import IDao from '@core/domain/daos/IDao';
import Term from '@core/domain/entities/Term';

export default interface ITermDao extends IDao<Term> {
	findByYearAndMajors(fromYear: number, toYear: number, majorsId: number): Promise<Term[]>;
}
