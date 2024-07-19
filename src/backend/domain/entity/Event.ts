import { EventName } from "../vo/EventName"

export class Event {
  private constructor(
    readonly timestamp: Date, 
    readonly name: EventName, 
    readonly userId: number, 
    readonly companyId: number, 
    readonly routeId: number, 
    readonly stopId: number, 
    readonly jobId: number){}

  static create(name: string, userId: number, companyId: number, routeId: number, stopId: number, jobId: number): Event{
    return new Event(
      new Date(),
      new EventName(name),
      userId,
      companyId,
      routeId,
      stopId,
      jobId
    );
  }

  getName(): string{
    return this.name.toString();
  }
}