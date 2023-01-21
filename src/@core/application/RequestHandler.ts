import { injectable, inject } from 'inversify';
import ErrorCollector from '@core/infrastructure/utilities/ErrorCollector';
import { Request } from 'express';

@injectable()
export default abstract class RequestHandler {
	@inject('ErrorCollector') protected errorCollector!: ErrorCollector;

	protected async validate(request: Request): Promise<any> {}

	public abstract handle(request: Request): Promise<any>;
}
