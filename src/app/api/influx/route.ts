import { NextRequest, NextResponse } from 'next/server';
import { getEvents, saveEvent } from '@/backend/main';

type UserAction = {
  event: string;
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
  await saveEvent.execute({
    event: body.event,
    user: {
      userId: body.user.userId,
      companyId: body.user.companyId,
    },
    route: {
      routeId: body.route.routeId,
      stopId: body.route.stopId,
    },
    jobId: body.jobId,
  });
  return NextResponse.json({status: 'OK'});
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
  // const companyId = parseInt(searchParams.get('companyId') as string) as QueryParams['companyId'];

  if(!start){
    return NextResponse.json({error: 'Invalid start time'})
  }
  // if(!companyId){
  //   return NextResponse.json({error: 'Invalid companyId'})
  // }

  const result = await getEvents.execute(start, end)
  return NextResponse.json(result);
}
