'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthError} from '@supabase/supabase-js'
import { supabase } from './supabase' 

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        }
    )

    return () => subscription.unsubscribe()
    }, [])
