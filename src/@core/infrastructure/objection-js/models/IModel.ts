import Entity, { IEntity } from '@core/domain/entities/Entity';
import Objection from 'objection';

export interface IModel<T extends IEntity> {
	convertJSONModelToEntity: (dbJson: Objection.Pojo) => Entity<T>;
}
