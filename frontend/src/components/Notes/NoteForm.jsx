import { useState, useRef, useEffect } from 'react'
import { FiCheck, FiImage } from 'react-icons/fi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BsPin, BsPinFill } from 'react-icons/bs'
import { NOTE_COLORS } from './noteColors'
import './NoteForm.css'

export default function NoteForm({ onAdd }) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [color, setColor] = useState('#ffffff')
  const [showColors, setShowColors] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        handleClose()
      }
    }
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expanded, title, content, pinned, color])

  function handleClose() {
    if (title.trim() || content.trim()) {
      onAdd({
        title: title.trim(),
        content: content.trim(),
        pinned,
        color
      })
    }
    setTitle('')
    setContent('')
    setPinned(false)
    setColor('#ffffff')
    setShowColors(false)
    setExpanded(false)
  }

  if (!expanded) {
    return (
      <div className="keep-form-collapsed" onClick={() => setExpanded(true)}>
        <span>Take a note...</span>
        <div className="keep-form-collapsed-icons">
          <FiCheck size={22} color="#5f6368" />
          <FiImage size={22} color="#5f6368" />
        </div>
      </div>
    )
  }

  return (
    <div className="keep-form" ref={formRef} style={{ backgroundColor: color }}>
      <div className="keep-form-top">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="keep-form-title"
          autoFocus
        />
        <button
          className="keep-form-pin"
          onClick={() => setPinned(!pinned)}
          title={pinned ? 'Unpin note' : 'Pin note'}
        >
          {pinned ? <BsPinFill size={18} /> : <BsPin size={18} />}
        </button>
      </div>
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="keep-form-content"
        rows={3}
      />
      <div className="keep-form-toolbar">
        <div className="keep-form-tools">
          <button
            className="keep-toolbar-btn"
            onClick={() => setShowColors(!showColors)}
            title="Background options"
          >
            <IoColorPaletteOutline size={18} />
          </button>
        </div>
        <button className="keep-form-close-btn" onClick={handleClose}>
          Close
        </button>
      </div>

      {showColors && (
        <div className="keep-form-colors">
          {NOTE_COLORS.map((c) => (
            <button
              key={c.value}
              className={`keep-color-dot ${color === c.value ? 'active' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              title={c.name}
            >
              {color === c.value && <FiCheck size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
