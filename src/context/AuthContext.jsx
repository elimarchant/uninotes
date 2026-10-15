import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'uninotes_users'
const SESSION_KEY = 'uninotes_current_user'

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
function generateUid() {
  return 'user_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) setCurrentUser(JSON.parse(saved))
    } catch {}
    setLoading(false)
  }, [])

  function persistUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    setCurrentUser(user)
  }

  function signUpWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      const users = getUsers()
      if (users.find(u => u.email === email)) {
        reject({ code: 'auth/email-already-in-use' })
        return
      }
      const user = {
        uid: generateUid(),
        email,
        password,
        displayName: email.split('@')[0].replace(/[._]/g, ' '),
        createdAt: Date.now(),
      }
      saveUsers([...users, user])
      const session = { uid: user.uid, email: user.email, displayName: user.displayName }
      persistUser(session)
      resolve(session)
    })
  }

  function signInWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      const users = getUsers()
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        reject({ code: 'auth/invalid-credential' })
        return
      }
      const session = { uid: user.uid, email: user.email, displayName: user.displayName }
      persistUser(session)
      resolve(session)
    })
  }

  function signInWithGoogle() {
    return new Promise((resolve) => {
      const users = getUsers()
      const email = 'demo.google.user@gmail.com'
      let user = users.find(u => u.email === email)
      if (!user) {
        user = { uid: generateUid(), email, password: '', displayName: 'Google User', createdAt: Date.now() }
        saveUsers([...users, user])
      }
      const session = { uid: user.uid, email: user.email, displayName: user.displayName }
      persistUser(session)
      resolve(session)
    })
  }

  function logout() {
    return new Promise((resolve) => {
      localStorage.removeItem(SESSION_KEY)
      setCurrentUser(null)
      resolve()
    })
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUpWithEmail, signInWithEmail, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider
