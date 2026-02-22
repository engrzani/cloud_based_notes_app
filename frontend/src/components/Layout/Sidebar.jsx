import { FiFileText, FiBell, FiEdit, FiArchive, FiTrash2, FiTag } from 'react-icons/fi'
import './Sidebar.css'

const NAV_ITEMS = [
  { id: 'notes', label: 'Notes', icon: FiFileText },
  { id: 'reminders', label: 'Reminders', icon: FiBell },
]

const BOTTOM_ITEMS = [
  { id: 'archive', label: 'Archive', icon: FiArchive },
  { id: 'trash', label: 'Trash', icon: FiTrash2 },
]

export default function Sidebar({ expanded, activeView, onViewChange, labels, onEditLabels }) {
  return (
    <nav className={`keep-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <Icon size={20} />
            <span className="sidebar-label">{item.label}</span>
          </button>
        )
      })}

      {/* Labels */}
      {labels && labels.length > 0 && (
        <div className="sidebar-divider" />
      )}
      {labels && labels.map((label) => (
        <button
          key={label}
          className={`sidebar-item ${activeView === `label-${label}` ? 'active' : ''}`}
          onClick={() => onViewChange(`label-${label}`)}
          title={label}
        >
          <FiTag size={20} />
          <span className="sidebar-label">{label}</span>
        </button>
      ))}
      <button className="sidebar-item" onClick={onEditLabels} title="Edit labels">
        <FiEdit size={20} />
        <span className="sidebar-label">Edit labels</span>
      </button>

      <div className="sidebar-divider" />

      {BOTTOM_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={item.label}
          >
            <Icon size={20} />
            <span className="sidebar-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
