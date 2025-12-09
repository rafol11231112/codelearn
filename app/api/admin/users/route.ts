import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    await requireAdmin(token);

    const users = await User.find()
      .sort({ joinedAt: -1 })
      .select('-password');

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 403 }
    );
  }
}
