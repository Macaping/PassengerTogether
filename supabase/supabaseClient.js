import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

console.log(SUPABASE_URL);
console.log(SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
// Supabase 클라이언트 초기화 및 연결 테스트
const testSupabaseConnection = async () => {
  try {
    // 세션 확인 (인증 API 테스트)
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    console.log('Supabase 클라이언트가 정상적으로 초기화되었습니다.');
    console.log('현재 세션 정보:', data);
  } catch (error) {
    console.error('Supabase 연결 오류:', error.message);
  }
};

// 연결 테스트 호출
testSupabaseConnection();
