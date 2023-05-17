import Entity from './Entity';
import lodash from 'lodash';
import Lecturer from './Lecturer';
export enum TypeNotificationLecturer {}
export interface IProps {
	lecturer: Lecturer;
	message: string;
	type: TypeNotificationLecturer;
	read: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
export default class NotificationLecturer extends Entity<IProps> {
	static create(props?: IProps, id?: number) {
		return new NotificationLecturer(props, id);
	}
	static createById(id?: number) {
		return new NotificationLecturer(undefined, id);
	}
	get message() {
		return this.props.message;
	}
	get read() {
		return this.props.read;
	}
	get lecturer() {
		return this.props.lecturer;
	}
	get lecturerId() {
		return this.props.lecturer.id!;
	}
	get type() {
		return this.props.type;
	}
	get createdAt() {
		return this.props.createdAt || new Date();
	}
	get updatedAt() {
		return this.props.updatedAt || new Date();
	}
	get toJSON() {
		const { lecturer, ...props } = lodash.cloneDeep(this._props || {});

		return { id: this.id, ...props, lecturer: lecturer?.props };
	}
}
