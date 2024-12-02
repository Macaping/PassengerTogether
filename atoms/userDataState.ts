import { Database } from "@/lib/supabase_type";
import { atom } from "recoil";

type UserData = Database["public"]["Tables"]["users"]["Row"];

export const userDataState = atom<UserData | null>({
  key: "userDataState",
  default: null,
});
