import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSession } from "./useSession";

/**
 * 현재 사용자 정보를 가져오는 커스텀 훅입니다.
 *
 * @example
 * ```tsx
 * const { user } = useUser();
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
export function useUser() {
  const { session } = useSession();
  const [user, setUser] = useState<User | undefined>(session?.user);

  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  return { user };
}
