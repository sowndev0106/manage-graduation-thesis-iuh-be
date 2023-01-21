import Lodash from 'lodash';

export interface IEntity
{
	id: string|undefined;
	props: any;
}

export default abstract class Entity<T> implements IEntity
{
	protected readonly _id?: string;
	protected _props: T;

	protected constructor( props: T, id?: string )
	{
		this._id = id;
		this._props = props;
	}

	public get id(): string|undefined
	{
		return this._id;
	}

	public get props(): T
	{
		return Lodash.cloneDeep( this._props );
	}
}
