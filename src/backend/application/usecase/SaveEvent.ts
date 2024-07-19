import { Event } from "@/backend/domain/entity/Event";
import type { EventRepository } from "@/backend/infra/repository/EventRepository";

type Input = {
  event: string;
  user: {
    userId: number;
    companyId: number;
  };
  route: {
    routeId: number;
    stopId: number;
  };
  jobId: number;
};


export class SaveEvent {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(input: Input): Promise<void> {
    const event = Event.create(input.event, input.user.userId, input.user.companyId, input.route.routeId, input.route.stopId, input.jobId);
    await this.eventRepository.saveEvent(event);
  }
}
  