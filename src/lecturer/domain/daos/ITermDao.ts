import IDao from '@core/domain/daos/IDao';
import Term from '@core/domain/entities/Term';

export default interface ITermDao extends IDao<Term> {
	findByNameAndMajors(name: string, majorsId: number): Promise<Term | null>;
}