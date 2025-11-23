import { supabase } from '../lib/supabase';

export const signUp = async (email: string, password: string) => {
  try {
    if (!supabase) {
      console.log('Demo mode: Sign up would succeed');
      return { 
        success: true, 
        data: { user: { email }, session: null } 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!supabase) {
      console.log('Demo mode: Sign in successful');
      return { 
        success: true, 
        data: { user: { email }, session: null } 
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    if (!supabase) {
      return { success: true };
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const checkAuthStatus = async () => {
  try {
    if (!supabase) {
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.log('Auth check error (this is normal on first load):', error);
    return null;
  }
};
