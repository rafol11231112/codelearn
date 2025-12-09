import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/models/Lesson';
import Section from '@/models/Section';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const sections = await Section.find().sort({ order: 1 });
    const lessons = await Lesson.find().sort({ order: 1 });

    const sectionsWithLessons = sections.map(section => ({
      ...section.toObject(),
      lessons: lessons.filter(lesson => 
        lesson.sectionId.toString() === section._id.toString()
      ),
    }));

    return NextResponse.json({ sections: sectionsWithLessons });
  } catch (error: any) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

