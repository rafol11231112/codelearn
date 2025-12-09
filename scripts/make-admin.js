require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  isAdmin: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function makeAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get email from command line or use first user
    const emailArg = process.argv[2];
    
    let user;
    if (emailArg) {
      user = await User.findOne({ email: emailArg });
      if (!user) {
        console.log(`❌ User with email "${emailArg}" not found`);
        process.exit(1);
      }
    } else {
      // Make the first user admin
      user = await User.findOne().sort({ joinedAt: 1 });
      if (!user) {
        console.log('❌ No users found in database');
        process.exit(1);
      }
    }

    user.isAdmin = true;
    await user.save();

    console.log(`\n✅ Made ${user.username} (${user.email}) an admin!`);
    console.log(`\n🎉 You can now access the admin panel at: /admin`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

makeAdmin();
