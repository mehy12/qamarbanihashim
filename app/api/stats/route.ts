import { db } from '@/lib/db';
import { donations } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [stats] = await db.select({
      totalRaised: sql<number>`COALESCE(SUM(${donations.amount}), 0)`,
      donorCount: sql<number>`COUNT(*)`,
    }).from(donations);

    return NextResponse.json({
      totalRaised: Number(stats.totalRaised),
      donorCount: Number(stats.donorCount),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ totalRaised: 0, donorCount: 0 });
  }
}
