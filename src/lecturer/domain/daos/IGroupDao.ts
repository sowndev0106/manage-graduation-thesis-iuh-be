import IDao from '@core/domain/daos/IDao';
import Group from '@core/domain/entities/Group';

export default interface IGroupDao extends IDao<Group> {
	findOne(studentTermId: number): Promise<Group | null>;
	findAll(termId?: number, topicId?: number): Promise<Group[]>;
}
