import type { DatabaseConnection } from "@/backend/infra/database/DatabaseConnection";

export class GetEventsQuery {
  constructor(private readonly influx: DatabaseConnection) {}

  async execute(companyId: number, start: string, end?: string): Promise<any[]> {
    const query = `
      from(bucket: "${this.influx.bucket}")
      |> range(start: ${start}${end ? `, stop: ${end}` : ''})
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> filter(fn: (r) => r.companyId == "${companyId}")
    `;
    const data = await this.influx.query(query);
    return data;
  }
}
