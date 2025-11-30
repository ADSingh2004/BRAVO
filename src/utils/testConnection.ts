import { supabase } from '../lib/supabase';

/**
 * Test database connection and verify tables exist
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Check connection
    const { error } = await supabase
      .from('exercises')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connected successfully!');
    
    // Test 2: Verify all tables are accessible
    const tables = [
      'user_profiles',
      'exercises', 
      'workout_entries',
      'workout_logs',
      'nutrient_logs',
      'user_progress',
      'user_goals'
    ];
    
    console.log('\n📋 Checking tables...');
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(0);
      
      if (tableError) {
        console.error(`❌ ${table}: ${tableError.message}`);
      } else {
        console.log(`✅ ${table}: accessible`);
      }
    }
    
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

/**
 * Get current authentication state
 */
export async function checkAuthStatus() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ Auth error:', error.message);
    return null;
  }
  
  if (session) {
    console.log('✅ User logged in:', session.user.email);
    return session.user;
  } else {
    console.log('ℹ️  No active session');
    return null;
  }
}
