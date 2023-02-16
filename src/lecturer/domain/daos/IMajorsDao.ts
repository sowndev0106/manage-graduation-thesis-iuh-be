import IDao from '@core/domain/daos/IDao';
import Majors from '@core/domain/entities/Majors';

export default interface IMajorsDao extends IDao<Majors> {
	findByName(name: string): Promise<Majors | null>;
}
