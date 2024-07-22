import { Env } from "@/app/api/env";
import { InfluxDB, type Point } from "@influxdata/influxdb-client";
import { DeleteAPI } from "@influxdata/influxdb-client-apis";

export interface DatabaseConnection {
  bucket: string;
  query<T>(query: string): Promise<T[]>;
  write(data: unknown): Promise<void>;
  clearDB(): Promise<void>;
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
    const data = await queryClient.collectRows<T>(query);
    return data;
  }
  
  async write(point: Point): Promise<void> {
    const writeClient = this.influxDB.getWriteApi(this.org, this.bucket, 'ns');
    writeClient.writePoint(point);
    await writeClient.flush();
  }

  async clearDB(): Promise<void> {
    const deleteAPI = new DeleteAPI(this.influxDB);

    try {
      await deleteAPI.postDelete({
        org: this.org,
        bucket: this.bucket,
        body: {
          start: '1970-01-01T00:00:00Z',
          stop: new Date().toISOString(),
          predicate: '',
        },
      });
      console.log('Data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }
}