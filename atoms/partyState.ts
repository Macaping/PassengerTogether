import { Database } from "@/lib/supabase_type";
import { atom } from "recoil";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export const partyState = atom<Room | null>({
  key: "partyState",
  default: null,
});
