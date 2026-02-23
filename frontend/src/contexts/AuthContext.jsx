import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider, microsoftProvider } from '../firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
  }

  function loginWithMicrosoft() {
    return signInWithPopup(auth, microsoftProvider)
  }

  function logout() {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Force token refresh to ensure we have a valid token
        try {
          await user.getIdToken(true)
        } catch (error) {
          console.error('Token refresh error:', error)
        }
      }
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Refresh token when user returns to the app (visibility change)
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && currentUser) {
        currentUser.getIdToken(true).catch((error) => {
          console.error('Token refresh on visibility change failed:', error)
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [currentUser])

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
