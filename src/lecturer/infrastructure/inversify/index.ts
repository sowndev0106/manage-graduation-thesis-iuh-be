import 'reflect-metadata';
import { Container } from 'inversify';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import Nodemailer from '@core/infrastructure/nodemailer';
import IMajorsDao from '@lecturer/domain/daos/IMajorsDao';
import IStudentDao from '@lecturer/domain/daos/IStudentDao';
import ILecturerDao from '@lecturer/domain/daos/ILecturerDao';
import StudentDao from '../objection-js/daos/StudentDao';
import MajorsDao from '../objection-js/daos/MajorsDao';
import LecturerDao from '../objection-js/daos/LecturerDao';
import ITermDao from '@lecturer/domain/daos/ITermDao';
import TermDao from '../objection-js/daos/TermDao';
import ITopicDao from '@lecturer/domain/daos/ITopicDao';
import TopicDao from '../objection-js/daos/TopicDao';
import ILecturerTermDao from '@lecturer/domain/daos/ILecturerTermDao';
import LecturerTermDao from '../objection-js/daos/LecturerTermDao';
import IStudentTermDao from '@lecturer/domain/daos/IStudentTermDao';
import StudentTermDao from '../objection-js/daos/StudentTermDao';
import IEvaluationDao from '@lecturer/domain/daos/IEvaluationDao';
import EvaluationDao from '../objection-js/daos/EvaluationDao';
import IAssignDao from '@lecturer/domain/daos/IAssignDao';
import ITranscriptDao from '@lecturer/domain/daos/ITranscriptDao';
import AssignDao from '../objection-js/daos/AssignDao';
import TranscriptDao from '../objection-js/daos/TranscriptDao';
import IGroupDao from '@lecturer/domain/daos/IGroupDao';
import GroupDao from '../objection-js/daos/GroupDao';
import IGroupLecturerDao from '@lecturer/domain/daos/IGroupLecturerDao';
import IGroupLecturerMemberDao from '@lecturer/domain/daos/IGroupLecturerMemberDao';
import GroupLecturerDao from '../objection-js/daos/GroupLecturerDao';
import GroupLecturerMemberDao from '../objection-js/daos/GroupLecturerMemberDao';
import IGroupMemberDao from '@lecturer/domain/daos/IGroupMemberDao';
import GroupMemberDao from '../objection-js/daos/GroupMemberDao';
import IAchievementDao from '@lecturer/domain/daos/IAchievementDao';
import AchievementDao from '../objection-js/daos/AchievementDao';
import INotificationLecturerDao from '@lecturer/domain/daos/INotificationLecturerDao';
import NotificationLecturerDao from '../objection-js/daos/NotificationLecturerDao';

const container = new Container({
	autoBindInjectable: true,
	skipBaseClassChecks: true,
});

// Utilities
container.bind<ErrorCollector>('ErrorCollector').to(ErrorCollector);

// Mail
container.bind<Nodemailer>('Nodemailer').to(Nodemailer);

// Daos
container.bind<IMajorsDao>('MajorsDao').to(MajorsDao);
container.bind<IStudentDao>('StudentDao').to(StudentDao);
container.bind<ILecturerDao>('LecturerDao').to(LecturerDao);
container.bind<ITermDao>('TermDao').to(TermDao);
container.bind<ITopicDao>('TopicDao').to(TopicDao);

container.bind<ILecturerTermDao>('LecturerTermDao').to(LecturerTermDao);
container.bind<IStudentTermDao>('StudentTermDao').to(StudentTermDao);
container.bind<IEvaluationDao>('EvaluationDao').to(EvaluationDao);
container.bind<IAssignDao>('AssignDao').to(AssignDao);
container.bind<ITranscriptDao>('TranscriptDao').to(TranscriptDao);
container.bind<IGroupDao>('GroupDao').to(GroupDao);
container.bind<IGroupMemberDao>('GroupMemberDao').to(GroupMemberDao);
container.bind<IGroupLecturerDao>('GroupLecturerDao').to(GroupLecturerDao);
container.bind<IGroupLecturerMemberDao>('GroupLecturerMemberDao').to(GroupLecturerMemberDao);
container.bind<IAchievementDao>('AchievementDao').to(AchievementDao);
container.bind<INotificationLecturerDao>('NotificationLecturerDao').to(NotificationLecturerDao);
container.bind('NodeMailer').to(Nodemailer);

export default container;
