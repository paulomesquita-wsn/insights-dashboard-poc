import { Event } from "@/backend/domain/entity/Event";
import { Point } from "@influxdata/influxdb-client";
import { type DatabaseConnection } from "../database/DatabaseConnection";

export interface EventRepository {
  saveEvent(event: Event): Promise<void>;
} 

export class InfluxEventRepository implements EventRepository{
  constructor(private influx: DatabaseConnection){}

  async saveEvent(event: Event): Promise<void> {
    const point = new Point(event.getName())
      .uintField('userId', event.userId)
      .uintField('companyId', event.companyId)
      .uintField('routeId', event.routeId)
      .uintField('stopId', event.stopId)
      .uintField('jobId', event.jobId)
      .timestamp(event.timestamp);
    await this.influx.write(point);
  }

}