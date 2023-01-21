import { IEntity } from '@core/domain/entities/Entity';

export default interface IRepository<T extends IEntity>
{
    add( entity: T ): Promise<T>;
    delete( entity: T ): Promise<T>;
    update( entity: T ): Promise<T>;
    findOneById( id: string ): Promise<T|null>;
    all(): Promise<T[]>;
}
