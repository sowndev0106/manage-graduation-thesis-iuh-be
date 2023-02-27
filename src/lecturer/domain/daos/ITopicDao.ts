import IDao from '@core/domain/daos/IDao';
import Topic from '@core/domain/entities/Topic';

export default interface ITopicDao extends IDao<Topic> {
	findByNameLecturAndTerm(name: string, lecturer: number, term: number): Promise<Topic | null>;
	findAll(term?: number, lecturer?: number): Promise<Topic[]>;
}
