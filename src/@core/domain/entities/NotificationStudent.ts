import Entity from "./Entity";
import lodash from "lodash";
import Student from "./Student";
export type TypeNotificationStudent =
  | "ACHIEVEMENT"
  | "STUDENT"
  | "GROUP_MEMBER"
  | "CHOOSE_TOPIC"
  | "NEW_GROUP_MEMBER"
  | "REQUEST_JOIN_GROUP"
  | "CHANGE_TYPE_REPORT_GROUP";
export interface IProps {
  student: Student;
  message: string;
  read: boolean;
  type: TypeNotificationStudent;
  createdAt?: Date;
  updatedAt?: Date;
}
export default class NotificationStudent extends Entity<IProps> {
  static create(props?: IProps, id?: number) {
    return new NotificationStudent(props, id);
  }
  static createById(id?: number) {
    return new NotificationStudent(undefined, id);
  }
  get message() {
    return this.props.message;
  }
  get student() {
    return this.props.student;
  }
  get studentId() {
    return this.props.student.id!;
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
  get read() {
    return this.props.read;
  }
  get toJSON() {
    const { student, ...props } = lodash.cloneDeep(this._props || {});

    return { id: this.id, ...props, student: student?.toJSON };
  }
}
