import { useState } from 'react'
import { FiEdit2, FiTrash2, FiArchive, FiTag, FiCheck } from 'react-icons/fi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BsPin, BsPinFill, BsArchive } from 'react-icons/bs'
import { MdOutlineUnarchive } from 'react-icons/md'
import { NOTE_COLORS } from './noteColors'
import './NoteCard.css'

export default function NoteCard({ note, onUpdate, onDelete, onClick, activeView }) {
  const [showColors, setShowColors] = useState(false)
  const [showLabels, setShowLabels] = useState(false)

  function handlePin(e) {
    e.stopPropagation()
    onUpdate(note.id, { pinned: !note.pinned })
  }

  function handleArchive(e) {
    e.stopPropagation()
    onUpdate(note.id, { archived: !note.archived })
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (activeView === 'trash') {
      // Permanently delete
      if (window.confirm('Delete note forever?')) {
        onDelete(note.id)
      }
    } else {
      // Move to trash
      onUpdate(note.id, { trashed: true })
    }
  }

  function handleRestore(e) {
    e.stopPropagation()
    onUpdate(note.id, { trashed: false })
  }

  function handleColorChange(color) {
    onUpdate(note.id, { color })
    setShowColors(false)
  }

  function formatDate(timestamp) {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div
      className="keep-card"
      style={{ backgroundColor: note.color || '#fff' }}
      onClick={() => onClick && onClick(note)}
    >
      {/* Pin button */}
      <button
        className={`keep-card-pin ${note.pinned ? 'pinned' : ''}`}
        onClick={handlePin}
        title={note.pinned ? 'Unpin note' : 'Pin note'}
      >
        {note.pinned ? <BsPinFill size={16} /> : <BsPin size={16} />}
      </button>

      {/* Content */}
      <div className="keep-card-body">
        {note.title && <h3 className="keep-card-title">{note.title}</h3>}
        {note.content && <p className="keep-card-content">{note.content}</p>}
      </div>

      {/* Labels */}
      {note.labels && note.labels.length > 0 && (
        <div className="keep-card-labels">
          {note.labels.map((label) => (
            <span key={label} className="keep-card-label">{label}</span>
          ))}
        </div>
      )}

      {/* Footer with date */}
      <span className="keep-card-date">{formatDate(note.updatedAt)}</span>

      {/* Action toolbar */}
      <div className="keep-card-toolbar" onClick={(e) => e.stopPropagation()}>
        {activeView === 'trash' ? (
          <>
            <button className="keep-card-tool" onClick={handleRestore} title="Restore">
              <MdOutlineUnarchive size={16} />
            </button>
            <button className="keep-card-tool" onClick={handleDelete} title="Delete forever">
              <FiTrash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <button className="keep-card-tool" onClick={(e) => { e.stopPropagation(); setShowColors(!showColors); setShowLabels(false) }} title="Background options">
              <IoColorPaletteOutline size={16} />
            </button>
            <button className="keep-card-tool" onClick={handleArchive} title={note.archived ? 'Unarchive' : 'Archive'}>
              {note.archived ? <MdOutlineUnarchive size={16} /> : <FiArchive size={16} />}
            </button>
            <button className="keep-card-tool" onClick={handleDelete} title="Delete">
              <FiTrash2 size={16} />
            </button>
          </>
        )}
      </div>

      {/* Color picker popup */}
      {showColors && (
        <div className="keep-card-color-picker" onClick={(e) => e.stopPropagation()}>
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              className={`keep-color-dot ${note.color === c.value ? 'active' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => handleColorChange(c.value)}
              title={c.name}
            >
              {note.color === c.value && <FiCheck size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
