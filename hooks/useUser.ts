import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSession } from "./useSession";

export function useUser() {
  const { session } = useSession();
  const [user, setUser] = useState<User | undefined>(session.current?.user);

  useEffect(() => {
    setUser(session.current?.user);
  }, [session]);

  return { user };
}
