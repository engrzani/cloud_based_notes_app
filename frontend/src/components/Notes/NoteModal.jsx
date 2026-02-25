import { useState, useEffect, useRef } from 'react'
import { FiArchive, FiTrash2, FiCheck, FiTag, FiBell, FiX } from 'react-icons/fi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BsPin, BsPinFill } from 'react-icons/bs'
import { NOTE_COLORS } from './noteColors'
import './NoteModal.css'

export default function NoteModal({ note, onUpdate, onDelete, onClose, labels }) {
  const [title, setTitle] = useState(note.title || '')
  const [content, setContent] = useState(note.content || '')
  const [showColors, setShowColors] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
  const [showReminderPicker, setShowReminderPicker] = useState(false)
  const [noteLabels, setNoteLabels] = useState(note.labels || [])
  const [customDateTime, setCustomDateTime] = useState('')
  const overlayRef = useRef(null)

  useEffect(() => {
    setTitle(note.title || '')
    setContent(note.content || '')
    setNoteLabels(note.labels || [])
  }, [note])

  function handleSave() {
    onUpdate(note.id, {
      title: title.trim(),
      content: content.trim(),
      labels: noteLabels
    })
    onClose()
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) {
      handleSave()
    }
  }

  function handlePin() {
    onUpdate(note.id, { pinned: !note.pinned })
  }

  function handleArchive() {
    onUpdate(note.id, { archived: !note.archived })
    onClose()
  }

  function handleDelete() {
    onUpdate(note.id, { trashed: true })
    onClose()
  }

  function handleColorChange(color) {
    onUpdate(note.id, { color })
  }

  function toggleLabel(label) {
    const updated = noteLabels.includes(label)
      ? noteLabels.filter((l) => l !== label)
      : [...noteLabels, label]
    setNoteLabels(updated)
    onUpdate(note.id, { labels: updated })
  }

  function handleSetReminder(reminderDate) {
    onUpdate(note.id, { reminder: reminderDate })
    setShowReminderPicker(false)
  }

  function handleRemoveReminder() {
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

  return (
    <div className="keep-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="keep-modal" style={{ backgroundColor: note.color || '#fff' }}>
        {/* Image */}
        {note.image && (
          <div className="keep-modal-image">
            <img src={note.image} alt="" />
          </div>
        )}

        {/* Header */}
        <div className="keep-modal-header">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="keep-modal-title"
            placeholder="Title"
          />
          <button
            className={`keep-modal-pin ${note.pinned ? 'pinned' : ''}`}
            onClick={handlePin}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            {note.pinned ? <BsPinFill size={20} /> : <BsPin size={20} />}
          </button>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="keep-modal-content"
          placeholder="Take a note..."
          rows={6}
          autoFocus
        />

        {/* Labels display */}
        {noteLabels.length > 0 && (
          <div className="keep-modal-labels">
            {noteLabels.map((label) => (
              <span key={label} className="keep-modal-label">
                {label}
                <button onClick={() => toggleLabel(label)}>✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Reminder display */}
        {note.reminder && (
          <div className="keep-modal-reminder">
            <FiBell size={14} />
            <span>{formatReminderDate(note.reminder)}</span>
            <button onClick={handleRemoveReminder} title="Remove reminder">
              <FiX size={14} />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="keep-modal-toolbar">
          <div className="keep-modal-tools">
            <button className="keep-modal-tool" onClick={() => { setShowReminderPicker(!showReminderPicker); setShowColors(false); setShowLabelPicker(false) }} title="Remind me">
              <FiBell size={18} />
            </button>
            <button className="keep-modal-tool" onClick={() => { setShowColors(!showColors); setShowLabelPicker(false); setShowReminderPicker(false) }} title="Background options">
              <IoColorPaletteOutline size={18} />
            </button>
            <button className="keep-modal-tool" onClick={() => { setShowLabelPicker(!showLabelPicker); setShowColors(false); setShowReminderPicker(false) }} title="Add label">
              <FiTag size={18} />
            </button>
            <button className="keep-modal-tool" onClick={handleArchive} title={note.archived ? 'Unarchive' : 'Archive'}>
              <FiArchive size={18} />
            </button>
            <button className="keep-modal-tool" onClick={handleDelete} title="Delete">
              <FiTrash2 size={18} />
            </button>
          </div>
          <button className="keep-modal-close" onClick={handleSave}>Close</button>
        </div>

        {/* Reminder picker */}
        {showReminderPicker && (
          <div className="keep-modal-reminder-picker">
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
                value={customDateTime}
                onChange={(e) => setCustomDateTime(e.target.value)}
              />
              {customDateTime && (
                <button
                  className="keep-reminder-save-btn"
                  onClick={() => {
                    handleSetReminder(new Date(customDateTime).toISOString())
                    setCustomDateTime('')
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        )}

        {/* Color picker */}
        {showColors && (
          <div className="keep-modal-color-picker">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.value}
                className={`keep-color-dot ${note.color === c.value ? 'active' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => handleColorChange(c.value)}
                title={c.name}
              >
                {note.color === c.value && <FiCheck size={14} />}
              </button>
            ))}
          </div>
        )}

        {/* Label picker */}
        {showLabelPicker && labels && (
          <div className="keep-modal-label-picker">
            <p className="keep-label-picker-title">Label note</p>
            {labels.map((label) => (
              <label key={label} className="keep-label-option">
                <input
                  type="checkbox"
                  checked={noteLabels.includes(label)}
                  onChange={() => toggleLabel(label)}
                />
                <span>{label}</span>
              </label>
            ))}
            {labels.length === 0 && (
              <p className="keep-label-empty">No labels created yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
