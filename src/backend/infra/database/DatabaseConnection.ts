import { Env } from "@/app/api/env";
import { InfluxDB, type Point } from "@influxdata/influxdb-client";

export interface DatabaseConnection {
  query<T>(query: string): Promise<T[]>;
  write(data: unknown): Promise<void>;
}

export class InfluxDatabaseConnection implements DatabaseConnection {
  influxDB: InfluxDB;
  org: string = 'wellsite';
  bucket: string = 'wellsite';

  constructor(){
    this.influxDB = new InfluxDB({token: Env.influxDB.token, url: Env.influxDB.url});
  }

  async query<T>(query: string): Promise<T[]> {
    const queryClient = this.influxDB.getQueryApi(this.org);
    const data = await queryClient.collectRows<T>(`
      from(bucket: "${this.bucket}") 
      ${query}`);
    return data;
  }
  
  async write(point: Point): Promise<void> {
    const writeClient = this.influxDB.getWriteApi(this.org, this.bucket, 's');
    writeClient.writePoint(point);
    await writeClient.flush();
  }
}