import { getDashboard } from "@/backend/main";
import { NextResponse, type NextRequest } from "next/server";

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

  const result = await getDashboard.execute(+companyId, start, end);
  return NextResponse.json(result);
}
