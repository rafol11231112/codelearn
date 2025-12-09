import { getUserFromToken } from './auth';
import User from '@/models/User';
import connectDB from './db';

export async function checkAdmin(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  
  try {
    const userId = getUserFromToken(token);
    if (!userId) return false;

    await connectDB();
    const user = await User.findById(userId);
    
    return user?.isAdmin || false;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function requireAdmin(token: string | null | undefined) {
  const isAdmin = await checkAdmin(token);
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}
