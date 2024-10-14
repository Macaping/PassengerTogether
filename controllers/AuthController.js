// src/controllers/AuthController.js
import { supabase } from '../supabase/supabaseClient';
import { User } from '../models/User';

export class AuthController {
  static async signUp(email, password) {
    try {
      console.log('회원가입 시도 중...');
      const { data, error } = await supabase.auth.signUp({ email, password });
  
      if (error) throw error;
      if (!data.user) {
        throw new Error('User 객체가 정의되지 않았습니다.');
      }
  
      console.log('회원가입 성공:', data.user);
      return new User(data.user.id, data.user.email);
    } catch (error) {
      console.error('컨트롤러 회원가입 에러:', error.message);
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      console.log('로그인 시도 중...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log('로그인 성공:', data.user);
      return new User(data.user.id, data.user.email);
    } catch (error) {
      console.error('로그인 에러:', error.message);
      throw error;
    }
  }

  static async signOut() {
    try {
      console.log('로그아웃 시도 중...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 에러:', error.message);
    }
  }

  static getCurrentUser() {
    return supabase.auth.getUser();
  }
}
