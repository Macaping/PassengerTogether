import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
// supabase의 Database 타입을 가져옵니다.
import { Database } from './supabase_type';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경이 웹인 경우에는 auth 옵션을 제외합니다.
const options = Platform.OS === 'web' ? {} : {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options);