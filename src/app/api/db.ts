import {InfluxDB} from '@influxdata/influxdb-client'
import { Env } from './env'

const db = new InfluxDB({token: Env.influxDB.token, url: Env.influxDB.url});
const org = 'wellsite';
const bucket = 'wellsite';

export const influx = {
  writeClient: db.getWriteApi(org, bucket, 's'),
  queryClient: db.getQueryApi(org),
  db,
  org,
  bucket
}