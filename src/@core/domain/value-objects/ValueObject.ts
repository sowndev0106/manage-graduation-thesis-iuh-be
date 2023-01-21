export default abstract class ValueObject<T>
{
    protected _props: T;

    protected constructor( props: T )
    {
        this._props = props;
    }

    public get props(): T
    {
        return this.props;
    }
}