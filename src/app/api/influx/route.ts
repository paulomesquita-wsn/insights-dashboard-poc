import { NextRequest, NextResponse } from 'next/server';
import { connectionDB, getEvents, saveEvent } from '@/backend/main';
import { users } from '@/backend/data';
import { eventOptions } from '@/backend/domain/vo/EventName';

export async function POST() {
  // const numberOfData = 74880000; // one year of data
  const numberOfData = 10000;

  await connectionDB.clearDB();

  for(let i = 0; i < numberOfData; i++){
    if(i % 1000 === 0){
      console.log(`Processing ${i} of ${numberOfData}`);
    }

    const user = users[Math.floor(Math.random() * users.length)];
    const event = eventOptions[Math.floor(Math.random() * eventOptions.length)];
    await saveEvent.execute({
      event: event,
      user: {
        userId: user.id,
        companyId: user.companyId,
      },
      route: {
        routeId: Math.floor(Math.random() * 100),
        stopId: Math.floor(Math.random() * 100),
      },
      jobId: Math.floor(Math.random() * 100),
    });
  }

  return NextResponse.json({ status: 'OK' });
}

type QueryParams = {
  start: string;
  end?: string;
  companyId: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start') as QueryParams['start'];
  const end = searchParams.get('end') as QueryParams['end'];
  const companyId = parseInt(searchParams.get('companyId') as string) as QueryParams['companyId'];

  if(!start){
    return NextResponse.json({ error: 'Invalid start time' })
  }
  if(!companyId){
    return NextResponse.json({ error: 'Invalid companyId' })
  }

  const result = await getEvents.execute(+companyId, start, end);
  const formattedResult = result.map((r) => {
    return {
      time: r._time,
      measurement: r._measurement,
      companyId: r.companyId,
      jobId: r.jobId,
      routeId: r.routeId,
      stopId: r.stopId,
      userId: r.userId
    }
  })
  return NextResponse.json(formattedResult);
}
