import Lodash from 'lodash';

export interface IEntity
{
	id: number|undefined;
	props: any;
}

export default abstract class Entity<T> implements IEntity
{
	protected readonly _id?: number;
	protected _props: T;

	protected constructor( props: T, id?: number )
	{
		this._id = id;
		this._props = props;
	}

	public get id(): number|undefined
	{
		return this._id;
	}

	public get props(): T
	{
		return Lodash.cloneDeep( this._props );
	}
}
