import IDao from '@core/domain/daos/IDao';
import Term from '@core/domain/entities/Term';

export default interface ITermDao extends IDao<Term> {
	findByYearAndMajors(majorsId: number, fromYear?: number, toYear?: number): Promise<Term[]>;
}
