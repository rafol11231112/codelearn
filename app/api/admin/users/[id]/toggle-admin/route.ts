import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    await requireAdmin(token);

    const { id } = await params;
    const { isAdmin } = await req.json();

    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 403 }
    );
  }
}
