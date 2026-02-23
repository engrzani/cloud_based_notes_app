import { useState } from 'react'
import { FiEdit2, FiTrash2, FiArchive, FiTag, FiCheck, FiBell, FiX } from 'react-icons/fi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BsPin, BsPinFill, BsArchive } from 'react-icons/bs'
import { MdOutlineUnarchive } from 'react-icons/md'
import { NOTE_COLORS } from './noteColors'
import './NoteCard.css'

export default function NoteCard({ note, onUpdate, onDelete, onClick, activeView }) {
  const [showColors, setShowColors] = useState(false)
  const [showLabels, setShowLabels] = useState(false)
  const [showReminderPicker, setShowReminderPicker] = useState(false)

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

  function handleSetReminder(reminderDate) {
    onUpdate(note.id, { reminder: reminderDate })
    setShowReminderPicker(false)
  }

  function handleRemoveReminder(e) {
    e.stopPropagation()
    onUpdate(note.id, { reminder: null })
  }

  function formatReminderDate(reminder) {
    if (!reminder) return ''
    const date = new Date(reminder)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const reminderDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    
    if (reminderDay.getTime() === today.getTime()) {
      return `Today, ${timeStr}`
    } else if (reminderDay.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${timeStr}`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${timeStr}`
    }
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

      {/* Image */}
      {note.image && (
        <div className="keep-card-image">
          <img src={note.image} alt="" />
        </div>
      )}

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

      {/* Reminder badge */}
      {note.reminder && (
        <div className="keep-card-reminder" onClick={(e) => e.stopPropagation()}>
          <FiBell size={12} />
          <span>{formatReminderDate(note.reminder)}</span>
          <button className="keep-reminder-remove" onClick={handleRemoveReminder} title="Remove reminder">
            <FiX size={12} />
          </button>
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
            <button className="keep-card-tool" onClick={(e) => { e.stopPropagation(); setShowReminderPicker(!showReminderPicker); setShowColors(false) }} title="Remind me">
              <FiBell size={16} />
            </button>
            <button className="keep-card-tool" onClick={(e) => { e.stopPropagation(); setShowColors(!showColors); setShowReminderPicker(false) }} title="Background options">
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

      {/* Reminder picker popup */}
      {showReminderPicker && (
        <div className="keep-card-reminder-picker" onClick={(e) => e.stopPropagation()}>
          <p className="keep-reminder-picker-title">Remind me</p>
          <button 
            className="keep-reminder-option"
            onClick={() => {
              const today = new Date()
              today.setHours(20, 0, 0, 0)
              handleSetReminder(today.toISOString())
            }}
          >
            <FiBell size={16} />
            <span>Later today</span>
            <span className="keep-reminder-time">8:00 PM</span>
          </button>
          <button 
            className="keep-reminder-option"
            onClick={() => {
              const tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(8, 0, 0, 0)
              handleSetReminder(tomorrow.toISOString())
            }}
          >
            <FiBell size={16} />
            <span>Tomorrow</span>
            <span className="keep-reminder-time">8:00 AM</span>
          </button>
          <button 
            className="keep-reminder-option"
            onClick={() => {
              const nextWeek = new Date()
              nextWeek.setDate(nextWeek.getDate() + 7)
              nextWeek.setHours(8, 0, 0, 0)
              handleSetReminder(nextWeek.toISOString())
            }}
          >
            <FiBell size={16} />
            <span>Next week</span>
            <span className="keep-reminder-time">Mon, 8:00 AM</span>
          </button>
          <div className="keep-reminder-custom">
            <label>Pick date & time</label>
            <input
              type="datetime-local"
              onChange={(e) => {
                if (e.target.value) {
                  handleSetReminder(new Date(e.target.value).toISOString())
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
