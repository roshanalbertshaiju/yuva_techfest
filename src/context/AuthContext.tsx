'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserProfile {
  uid: string
  email: string
  name: string
  isAdmin: boolean
  isManager?: boolean
  createdAt?: any
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Setup a real-time listener for the user's profile document in Firestore
        const profileRef = doc(db, 'users', firebaseUser.uid)
        unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile)
          } else {
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              isAdmin: false,
              isManager: false
            })
          }
          setLoading(false)
        }, (error) => {
          console.error("Error fetching user profile from Firestore:", error)
          setLoading(false)
        })
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile()
          unsubscribeProfile = null
        }
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeProfile) {
        unsubscribeProfile()
      }
    }
  }, [])

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
