import type { DatabaseConnection } from "@/backend/infra/database/DatabaseConnection";

export class GetDashboardQuery {
  constructor(private readonly influx: DatabaseConnection) {}

  private buildMeasurementsPerUserQuery(companyId: number, start: string, end: string): string {
    return `
      data = from(bucket: "${this.influx.bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.companyId == "${companyId}")

      measurementsPerUser = data
        |> group(columns: ["userId", "_measurement"])
        |> count(column: "_value")
        |> rename(columns: { "_value": "count" })

      lastAppOpened = data
        |> filter(fn: (r) => r._measurement == "APP_OPENED")
        |> group(columns: ["userId"])
        |> sort(columns: ["_time"], desc: true)
        |> unique(column: "userId")
        |> keep(columns: ["userId", "_time"])
        |> rename(columns: { "_time": "lastAppOpenedTime" })

      join(
        tables: {measurementsPerUser: measurementsPerUser, lastAppOpened: lastAppOpened},
        on: ["userId"]
      )
    `;
  }

  private buildUsersPerMeasurementPerMonthQuery(companyId: number, start: string, end: string): string {
    return `
      from(bucket: "${this.influx.bucket}")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r.companyId == "${companyId}")
        |> group(columns: ["_measurement", "userId"])
        |> aggregateWindow(every: 1mo, fn: count, createEmpty: false)
        |> group(columns: ["_start", "_measurement"])
        |> distinct(column: "userId")
        |> count(column: "_value")
        |> rename(columns: { "_value": "userCount" })
    `;
  }

  async execute(companyId: number, start: string, end?: string): Promise<{ perUser: any[]; perMonth: any[] }> {
    try {
      const startRange = start || "1970-01-01T00:00:00.000Z";
      const endRange = end || "2025-01-01T00:00:00.000Z";

      const measurementsPerUserQuery = this.buildMeasurementsPerUserQuery(companyId, startRange, endRange);
      const usersPerMeasurementPerMonthQuery = this.buildUsersPerMeasurementPerMonthQuery(companyId, startRange, endRange);

      const perUser = await this.influx.query(measurementsPerUserQuery);
      const perMonth = await this.influx.query(usersPerMeasurementPerMonthQuery);

      console.log(measurementsPerUserQuery, usersPerMeasurementPerMonthQuery)

      return { perUser, perMonth };
    } catch (error) {
      console.error("Error executing dashboard queries:", error);
      throw new Error("Failed to execute dashboard queries");
    }
  }
}
