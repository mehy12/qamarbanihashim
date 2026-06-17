import { db } from '@/lib/db';
import { donations } from '@/lib/db/schema';
import { desc, sql, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, amount, paymentMethod, utr, screenshotBase64 } = body;

    if (!name || !phone || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [donation] = await db.insert(donations).values({
      name,
      phone,
      amount: Number(amount),
      paymentMethod: paymentMethod || null,
      utr: utr || null,
      screenshotBase64: screenshotBase64 || null,
      status: 'pending',
    }).returning();

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');

    if (pin !== '0423') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allDonations = await db.select({
      id: donations.id,
      name: donations.name,
      phone: donations.phone,
      amount: donations.amount,
      paymentMethod: donations.paymentMethod,
      utr: donations.utr,
      status: donations.status,
      createdAt: donations.createdAt,
    }).from(donations).orderBy(desc(donations.createdAt));

    const [stats] = await db.select({
      totalRaised: sql<number>`COALESCE(SUM(${donations.amount}), 0)`,
      donorCount: sql<number>`COUNT(*)`,
    }).from(donations);

    return NextResponse.json({
      donations: allDonations,
      totalRaised: Number(stats.totalRaised),
      donorCount: Number(stats.donorCount),
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');
    const id = searchParams.get('id');

    if (pin !== '0423') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await db.delete(donations).where(eq(donations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting donation:', error);
    return NextResponse.json({ error: 'Failed to delete donation' }, { status: 500 });
  }
}
