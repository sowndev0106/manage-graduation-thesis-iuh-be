import IDao from '@core/domain/daos/IDao';
import Topic from '@core/domain/entities/Topic';

export default interface ITopicDao extends IDao<Topic> {
	findOne(props: { name: string; lecturerTermId: number }): Promise<Topic | null>;
	findAll(props: { lecturerTermId?: number; termId?: number }): Promise<Topic[]>;
}
