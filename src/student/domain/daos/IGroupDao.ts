import IDao from '@core/domain/daos/IDao';
import Group from '@core/domain/entities/Group';

export default interface IGroupDao extends IDao<Group> {
	findOneByTermAndStudent(termId: number, studentId: number): Promise<Group | null>;
	findAll(termId?: number, topicId?: number): Promise<Group[]>;
}
