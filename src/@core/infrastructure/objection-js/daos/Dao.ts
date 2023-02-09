import IDao from '@core/domain/daos/IDao';
import Entity, { IEntity } from '@core/domain/entities/Entity';
import { Model, PartialModelObject, QueryBuilder } from 'objection';

export default abstract class Dao<E extends IEntity, M extends Model> implements IDao<E> {
	protected abstract initQuery(): QueryBuilder<M, M[]>;
	protected abstract convertModelToEntity(model: M): E;
	protected abstract convertEntityToPartialModelObject(entity: E): PartialModelObject<M>;

	async insertEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new Error('Cannot insert undefined or null');
		}
		const partialModelObject = this.convertEntityToPartialModelObject(entity);
		const model = await this.initQuery().insertAndFetch(partialModelObject);

		if (model == undefined || model == null) {
			throw new Error('Fail to insert entity');
		}

		return this.convertModelToEntity(model);
	}

	async findEntityById(id: number | undefined): Promise<E | null> {
		if (!id) return null;
		const model = await this.initQuery().findById(id).execute();

		if (model == undefined || model == null) {
			return null;
		}

		return this.convertModelToEntity(model);
	}

	async updateEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new Error('Cannot update undefined or null');
		}

		if (entity.id == undefined || entity.id == null) {
			throw new Error('Cannot update without identifier');
		}

		const model = this.convertEntityToPartialModelObject(entity);

		const result = await this.initQuery().update(model).where('id', entity.id).execute();

		if (result <= 0) {
			throw new Error('Fail to update entity');
		}

		return entity;
	}

	async deleteEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new Error('Cannot delete undefined or null');
		}

		if (entity.id == undefined || entity.id == null) {
			throw new Error('Cannot delete without identifier');
		}

		const result = await this.initQuery().deleteById(entity.id).execute();

		if (result <= 0) {
			throw new Error('Fail to delete entity');
		}

		return entity;
	}

	async insertBulkOfEntities(entities: E[]): Promise<E[]> {
		const partialModelObjects = [];

		for (let entity of entities) {
			const partialModelObject = this.convertEntityToPartialModelObject(entity);

			if (partialModelObject) {
				partialModelObjects.push(partialModelObject);
			}
		}

		const models = await this.initQuery().insertAndFetch(partialModelObjects);

		let insertedEntities = [];

		for (let model of models) {
			const entity = this.convertModelToEntity(model);

			if (entity) {
				insertedEntities.push(entity);
			}
		}

		return insertedEntities;
	}

	async deleteBulkOfEntities(entities: E[]): Promise<E[]> {
		const ids = entities.map(entity => entity.id!);

		const result = await this.initQuery().whereIn('id', ids).delete();

		if (result <= 0) {
			throw new Error('Fail to delete entities');
		}

		return entities;
	}

	async updateBulkOfEntities(entities: E[]): Promise<E[]> {
		const updatedEntities: Array<E> = [];

		for (const entity of entities) {
			const updatedEntity = await this.updateEntity(entity);
			updatedEntities.push(updatedEntity);
		}

		return updatedEntities;
	}

	async getAllEntities() {
		const entities: Array<E> = [];

		const models = await this.initQuery().execute();

		for (const model of models) {
			if (model) {
				entities.push(this.convertModelToEntity(model));
			}
		}

		return entities;
	}

	async countAllEntities() {
		const query = this.initQuery();

		query.count('id', { as: 'count' });

		const result: any = await query.execute();

		return result[0]['count'];
	}
}
