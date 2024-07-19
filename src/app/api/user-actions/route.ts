import { NextRequest, NextResponse } from 'next/server';
import { influx } from '../db';
import { Point } from '@influxdata/influxdb-client';

const routeEventOptions = ['ROUTE_CREATED', 'ROUTE_RECEIVED', 'ROUTE_OPENED', 'ROUTE_STARTED', 'ROUTE_ARRIVE_STOP', 'ROUTE_COMPLETED'] as const;
type RouteEvents = typeof routeEventOptions[number];

const appEventOptions = ['APP_OPENED', 'APP_SESSION_STARTED'] as const;
type AppEvents = typeof appEventOptions[number];

const eventOptions = [...routeEventOptions, ...appEventOptions];
type Events = RouteEvents | AppEvents;

type UserAction = {
  action: Events;
  timestamp: Date;
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

export async function POST(request: NextRequest) {
  const body: UserAction = await request.json();
  if(!eventOptions.includes(body.action)){
    return NextResponse.json({error: 'Invalid event action'})
  }
  if(!body.user || !body.user.userId || !body.user.companyId){
    return NextResponse.json({error: 'Invalid user data'})
  }
  if(!body.route || !body.route.routeId || !body.route.stopId){
    return NextResponse.json({error: 'Invalid route data'})
  }
  if(!body.jobId){
    return NextResponse.json({error: 'Invalid job data'})
  }

  const point = new Point(body.action)
    .uintField('userId', body.user.userId)
    .uintField('companyId', body.user.companyId)
    .uintField('routeId', body.route.routeId)
    .uintField('stopId', body.route.stopId)
    .uintField('jobId', body.jobId)
    .timestamp(body.timestamp);
  influx.writeClient.writePoint(point);
  await influx.writeClient.flush();
  return NextResponse.json({status: 'OK'});
}


export async function GET(request: NextRequest){
  
  const query = `
    from(bucket: "${influx.bucket}") 
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "measurement1")`;
  const result = await influx.queryClient.collectRows(query);
  return NextResponse.json(result);
}