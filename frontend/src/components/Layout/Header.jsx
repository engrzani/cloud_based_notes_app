import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi'
import './Header.css'

export default function Header({ searchTerm, onSearchChange, viewMode, onViewModeToggle, onMenuToggle }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Failed to log out:', err)
    }
  }

  return (
    <header className="keep-header">
      <div className="keep-header-left">
        <button className="keep-header-menu" onClick={onMenuToggle} title="Main menu">
          <FiMenu size={22} />
        </button>
        <div className="keep-header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FBBC04" width="40" height="40">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
          </svg>
          <span className="keep-header-title">Cloud Notes</span>
        </div>
      </div>

      <div className="keep-header-search">
        <FiSearch size={18} className="keep-search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="keep-search-input"
        />
        {searchTerm && (
          <button className="keep-search-clear" onClick={() => onSearchChange('')}>✕</button>
        )}
      </div>

      <div className="keep-header-right">
        <button className="keep-header-icon-btn" onClick={() => window.location.reload()} title="Refresh">
          <FiRefreshCw size={20} />
        </button>
        <button
          className="keep-header-icon-btn"
          onClick={onViewModeToggle}
          title={viewMode === 'grid' ? 'List view' : 'Grid view'}
        >
          {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
        </button>

        {currentUser && (
          <div className="keep-user-menu">
            <img
              src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'U'}&background=667eea&color=fff&size=80`}
              alt="avatar"
              className="keep-user-avatar"
              referrerPolicy="no-referrer"
              onClick={handleLogout}
              title={`${currentUser.displayName || currentUser.email}\nClick to sign out`}
            />
          </div>
        )}
      </div>
    </header>
  )
}
