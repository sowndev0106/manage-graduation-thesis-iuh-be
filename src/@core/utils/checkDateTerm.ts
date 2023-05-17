import Term from '@core/domain/entities/Term';
import ErrorCode from '@core/domain/errors/ErrorCode';
type timeNow = 'SUBMIT_TOPIC' | 'CHOOSE_TOPIC' | 'DISCUSSION' | 'REPORT';
export default function checkDateTerm(term: Term, time: timeNow) {
	const dateNow = new Date();
	if (term.startDate > dateNow) {
		throw new ErrorCode('TERM_HAS_NOT_STARTED', `Term has not started yet: start term = ${term.startDate.toLocaleDateString()}`);
	}
	if (term.endDate < dateNow) {
		throw new ErrorCode('TERM_HAS_EXPRIED', `Term has expried: end term = ${term.endDate.toLocaleDateString()}`);
	}
	switch (time) {
		case 'SUBMIT_TOPIC': {
			return;
		}
		case 'CHOOSE_TOPIC': {
			return;
		}
		case 'DISCUSSION': {
			return;
		}
		case 'REPORT': {
			return;
		}
		default:
			break;
	}
}
