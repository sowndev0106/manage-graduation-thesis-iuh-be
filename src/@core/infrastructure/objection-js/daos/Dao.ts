import IDao from '@core/domain/daos/IDao';
import Entity, { IEntity } from '@core/domain/entities/Entity';
import ErrorCode from '@core/domain/errors/ErrorCode';
import { Model, PartialModelGraph, PartialModelObject, QueryBuilder, transaction, ModelClass } from 'objection';
export default abstract class Dao<E extends IEntity, M extends Model> implements IDao<E> {
	protected abstract initQuery(): QueryBuilder<M, M[]>;
	protected abstract getModel(): ModelClass<M>;
	protected abstract convertModelToEntity(model: M): E;
	protected abstract convertEntityToPartialModelObject(entity: E): PartialModelObject<M>;
	protected abstract convertEntityToPartialModelGraph(entity: E): PartialModelGraph<M>;

	async findGraphEntityById(id: number, grap: string): Promise<E | null> {
		if (!id) return null;

		const model = await this.initQuery().withGraphFetched(grap).findById(id).execute();

		if (model == undefined || model == null) {
			return null;
		}

		return this.convertModelToEntity(model);
	}
	async updateGraphEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Cannot insert undefined or null');
		}
		const partialModelObject = this.convertEntityToPartialModelGraph(entity);

		const model = await this.initQuery().upsertGraphAndFetch(partialModelObject);

		if (model == undefined || model == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Fail to insert entity');
		}

		return this.convertModelToEntity(model);
	}
	async insertGraphEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Cannot insert undefined or null');
		}
		const partialModelObject = this.convertEntityToPartialModelGraph(entity);
		const model = await this.initQuery().insertGraphAndFetch(partialModelObject);

		if (model == undefined || model == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Fail to insert entity');
		}

		return this.convertModelToEntity(model);
	}
	async insertGraphMultipleEntities(entities: E[]): Promise<E[]> {
		const model = this.getModel();
		return await transaction(model, async Bound => {
			const partialModelObjects = entities.map(e => this.convertEntityToPartialModelGraph(e));

			const models = await Bound.query().insertGraphAndFetch(partialModelObjects);

			if (models == undefined || models == null) {
				throw new ErrorCode('FAIL_CREATE_ENTITY', 'Fail to insert entity');
			}
			return models.map((model: any) => this.convertModelToEntity(model));
		});
	}

	async insertEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Cannot insert undefined or null');
		}
		const partialModelObject = this.convertEntityToPartialModelObject(entity);
		const model = await this.initQuery().insertAndFetch(partialModelObject);

		if (model == undefined || model == null) {
			throw new ErrorCode('FAIL_CREATE_ENTITY', 'Fail to insert entity');
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
			throw new ErrorCode('FAIL_UPDATE_ENTITY', 'Cannot update undefined or null');
		}

		if (entity.id == undefined || entity.id == null) {
			throw new ErrorCode('FAIL_UPDATE_ENTITY', 'Cannot update without identifier');
		}

		const model = this.convertEntityToPartialModelObject(entity);

		const result = await this.initQuery().update(model).where('id', entity.id).execute();

		if (result <= 0) {
			throw new ErrorCode('FAIL_UPDATE_ENTITY', 'Fail to update entity');
		}

		return entity;
	}

	async deleteEntity(entity: E): Promise<E> {
		if (entity == undefined || entity == null) {
			throw new ErrorCode('FAIL_DELETE_ENTITY', 'Cannot delete undefined or null');
		}

		if (entity.id == undefined || entity.id == null) {
			throw new ErrorCode('FAIL_DELETE_ENTITY', 'Cannot delete without identifier');
		}

		try {
			const result = await this.initQuery().deleteById(entity.id).execute();
			if (result <= 0) {
				throw new ErrorCode('FAIL_DELETE_ENTITY', 'Fail to delete entity');
			}
		} catch (error) {
			console.log(error);
			throw new ErrorCode('FAIL_DELETE_ENTITY', 'Fail to delete entity');
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

		try {
			const result = await this.initQuery().whereIn('id', ids).delete();
			if (result <= 0) {
				throw new ErrorCode('FAIL_DELETE_ENTITY', 'Fail to delete entity');
			}
		} catch (error) {
			console.log(error);
			throw new ErrorCode('FAIL_DELETE_ENTITY', 'Fail to delete entity');
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
	async getGraphAllEntities(grap: string): Promise<E[]> {
		const entities: Array<E> = [];

		const models = await this.initQuery().withGraphFetched(grap).execute();

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
