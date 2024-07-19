export const routeEventOptions = ['ROUTE_CREATED', 'ROUTE_RECEIVED', 'ROUTE_OPENED', 'ROUTE_STARTED', 'ROUTE_ARRIVE_STOP', 'ROUTE_COMPLETED'] as const;
export type RouteEventName = typeof routeEventOptions[number];

export const appEventOptions = ['APP_OPENED', 'APP_SESSION_STARTED'] as const;
export type AppEventName = typeof appEventOptions[number];

export const eventOptions = [...routeEventOptions, ...appEventOptions];
export type Name = RouteEventName | AppEventName;

export class EventName {
	constructor (readonly name: string) {
		if (!eventOptions.includes(name as Name)) {
			throw new Error(`Invalid event name: ${name}`);
		}
	}

	toString (): string {
		return this.name;
	}
}
