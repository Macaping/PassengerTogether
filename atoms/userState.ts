import { User } from "@supabase/supabase-js";
import { atom } from "recoil";

export const userState = atom<User | undefined>({
  key: "userState",
  default: undefined,
});
