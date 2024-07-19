import { GetEventsQuery } from "./application/query/GetEvents";
import { SaveEvent } from "./application/usecase/SaveEvent";
import { InfluxDatabaseConnection, type DatabaseConnection } from "./infra/database/DatabaseConnection";
import { InfluxEventRepository, type EventRepository } from "./infra/repository/EventRepository";

type DB = 'influx';
const db: DB = 'influx';

type Connections = Record<DB, DatabaseConnection>;

const connections: Connections = {
  influx: new InfluxDatabaseConnection(),
}

type Repositories = Record<DB, {
  eventRepository: EventRepository;
}>;

const repositories: Repositories = {
  influx: {
    eventRepository: new InfluxEventRepository(connections[db]),
  }
};

export const getEvents = new GetEventsQuery(connections[db]);
export const saveEvent = new SaveEvent(repositories[db].eventRepository);
