import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/models/Lesson';
import { requireAdmin } from '@/lib/admin';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    await requireAdmin(token);

    const { id } = await params;
    await Lesson.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 403 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    await requireAdmin(token);

    const { id } = await params;
    const body = await req.json();

    const lesson = await Lesson.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ lesson });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized' },
      { status: 403 }
    );
  }
}
