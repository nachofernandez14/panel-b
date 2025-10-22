import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
    public: {
        Tables: {
            agentes: {
                Row: {
                    agente_id: string;
                    usuario: string;
                    email: string;
                    avatar: string | null;
                    contraseña: string;
                }
                Insert: {
                    usuario: string;
                    email: string;
                    avatar?: string | null;
                    contraseña: string;
                }
                Update: {
                    usuario?: string;
                    email?: string;
                    avatar?: string | null;
                    contraseña?: string;
                }
            }
        }
    }
}