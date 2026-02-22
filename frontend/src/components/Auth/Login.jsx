import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { BsMicrosoft } from 'react-icons/bs'
import './Login.css'

export default function Login() {
  const { loginWithGoogle, loginWithMicrosoft, currentUser } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (currentUser) {
    navigate('/dashboard')
    return null
  }

  async function handleGoogleLogin() {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleMicrosoftLogin() {
    try {
      setError('')
      setLoading(true)
      await loginWithMicrosoft()
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to sign in with Microsoft. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBC04" width="48" height="48">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
            </svg>
          </div>
          <h1>Cloud Notes</h1>
          <p>Your notes, everywhere. Securely stored in the cloud.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-buttons">
          <button
            className="login-btn google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle size={22} />
            <span>Sign in with Google</span>
          </button>

          <button
            className="login-btn microsoft-btn"
            onClick={handleMicrosoftLogin}
            disabled={loading}
          >
            <BsMicrosoft size={20} color="#00a4ef" />
            <span>Sign in with Microsoft</span>
          </button>
        </div>

        <p className="login-footer">
          No passwords needed — sign in securely with your existing account.
        </p>
      </div>
    </div>
  )
}
