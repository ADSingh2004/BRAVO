import { supabase } from '../lib/supabase';

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Auto-confirm email for development (remove in production)
        emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Sign up failed' 
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Sign in failed' 
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Sign out failed' 
    };
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return session?.user || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
