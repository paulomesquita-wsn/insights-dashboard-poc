import type { DatabaseConnection } from "@/backend/infra/database/DatabaseConnection";

export class GetEventsQuery {
  constructor(private readonly influx: DatabaseConnection) {}

  async execute(start: string, end?: string): Promise<any[]> {
    const query = `
      |> range(start: ${start}${end ? `, stop: ${end}` : ''})
      |> group(columns: ["_time"])
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;
    const data = await this.influx.query(query);
    return data;
  }
}
