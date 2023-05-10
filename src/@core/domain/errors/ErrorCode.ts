export interface IErrorCodeInfo {
	key: string;
	statusCode: number;
}
export type IKeyErrorCode =
	| 'COMMON'
	| 'NOT_FOUND'
	| 'VALIDATE'
	| 'UNAUTHORIZED'
	| 'AUTHENTICATION'
	| 'FORBIDDEN'
	| 'CONFLICT'
	| 'SEND_MAIL_FAIL'
	| 'SERVER'
	| 'FAIL_CREATE_ENTITY'
	| 'FAIL_UPDATE_ENTITY'
	| 'FAIL_DELETE_ENTITY'
	| 'LECTURER_NOT_IN_TERM'
	| 'STUDENT_NOT_IN_TERM'
	| 'STUDENT_NOT_FOUND'
	| 'LECTURER_NOT_FOUND'
	| 'LECTURER_MISSING_EMAIL'
	| 'STUDENT_MISSING_EMAIL'
	| 'EVALUATION_DUPLICATE_NAME'
	| 'EVALUATION_SUM_GRADE'
	| 'GROUP_LECTURER_DUPLICATE_NAME'
	| 'IMPORT_LECTURER_MISSING_COLUMN'
	| 'DONT_HAVE_PERMISSION_THIS_MAJORS'
	| 'MAJORS_DUPLICATE_NAME';

export const ErrorCodeDefine: Record<IKeyErrorCode | string, IErrorCodeInfo> = {
	SERVER: {
		key: 'SERVER',
		statusCode: 500,
	},
	COMMON: {
		key: 'COMMON',
		statusCode: 400,
	},
	NOT_FOUND: {
		key: 'NOT_FOUND',
		statusCode: 404,
	},
	VALIDATE: {
		key: 'VALIDATE',
		statusCode: 422,
	},
	UNAUTHORIZED: {
		key: 'UNAUTHORIZED',
		statusCode: 422,
	},
	AUTHENTICATION: {
		key: 'AUTHENTICATION',
		statusCode: 401,
	},
	FORBIDDEN: {
		key: 'FORBIDDEN',
		statusCode: 403,
	},
	CONFLICT: {
		key: 'CONFLICT',
		statusCode: 409,
	},
	// USER
	LECTURER_NOT_FOUND: {
		key: 'LECTURER_NOT_FOUND',
		statusCode: 404,
	},
	STUDENT_NOT_FOUND: {
		key: 'STUDENT_NOT_FOUND',
		statusCode: 404,
	},
	LECTURER_MISSING_EMAIL: {
		key: 'LECTURER_MISSING_EMAIL',
		statusCode: 400,
	},
	STUDENT_MISSING_EMAIL: {
		key: 'STUDENT_MISSING_EMAIL',
		statusCode: 400,
	},
	IMPORT_LECTURER_MISSING_COLUMN: {
		key: 'IMPORT_LECTURER_MISSING_COLUMN',
		statusCode: 400,
	},
	DONT_HAVE_PERMISSION_THIS_MAJORS: {
		key: 'DONT_HAVE_PERMISSION_THIS_MAJORS',
		statusCode: 403,
	},
	// USER TERM
	LECTURER_NOT_IN_TERM: {
		key: 'LECTURER_NOT_IN_TERM',
		statusCode: 403,
	},
	STUDENT_NOT_IN_TERM: {
		key: 'STUDENT_NOT_IN_TERM',
		statusCode: 403,
	},

	// DAO
	FAIL_CREATE_ENTITY: {
		key: 'FAIL_CREATE_ENTITY',
		statusCode: 409,
	},
	FAIL_DELETE_ENTITY: {
		key: 'FAIL_DELETE_ENTITY',
		statusCode: 409,
	},
	FAIL_UPDATE_ENTITY: {
		key: 'FAIL_DELETE_ENTITY',
		statusCode: 409,
	},

	// mail service
	SEND_MAIL_FAIL: {
		key: 'SEND_MAIL_FAIL',
		statusCode: 500,
	},

	// EVALUATION
	EVALUATION_DUPLICATE_NAME: {
		key: 'EVALUATION_DUPLICATE_NAME',
		statusCode: 409,
	},
	EVALUATION_SUM_GRADE: {
		key: 'EVALUATION_SUM_GRADE',
		statusCode: 400,
	},

	// GROUP LECTURER
	GROUP_LECTURER_DUPLICATE_NAME: {
		key: 'GROUP_LECTURER_DUPLICATE_NAME',
		statusCode: 409,
	},

	// MAJORS
	MAJORS_DUPLICATE_NAME: {
		key: 'MAJORS_DUPLICATE_NAME',
		statusCode: 409,
	},
};
export default class ErrorCode extends Error {
	constructor(key: Partial<IKeyErrorCode>, message: string) {
		super(message);
		this.name = key;
	}
}
