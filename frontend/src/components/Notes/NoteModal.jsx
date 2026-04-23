import { useState, useEffect, useRef } from 'react'
import { FiArchive, FiTrash2, FiCheck, FiTag, FiImage } from 'react-icons/fi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BsPin, BsPinFill } from 'react-icons/bs'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase'
import { NOTE_COLORS } from './noteColors'
import './NoteModal.css'

export default function NoteModal({ note, onUpdate, onDelete, onClose, labels, currentUser }) {
  const [title, setTitle] = useState(note.title || '')
  const [content, setContent] = useState(note.content || '')
  const [showColors, setShowColors] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
  const [noteLabels, setNoteLabels] = useState(note.labels || [])
  const [imagePreview, setImagePreview] = useState(note.image || null)
  const [uploading, setUploading] = useState(false)
  const overlayRef = useRef(null)
  const imageInputRef = useRef(null)

  useEffect(() => {
    setTitle(note.title || '')
    setContent(note.content || '')
    setNoteLabels(note.labels || [])
    setImagePreview(note.image || null)
  }, [note])

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      // Upload to Firebase Storage
      const imageRef = ref(storage, `notes/${currentUser.uid}/${Date.now()}_${file.name}`)
      await uploadBytes(imageRef, file)
      const imageUrl = await getDownloadURL(imageRef)
      
      // Update note with image URL
      setImagePreview(imageUrl)
      onUpdate(note.id, { image: imageUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleRemoveImage() {
    setImagePreview(null)
    onUpdate(note.id, { image: null })
  }

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


  return (
    <div className="keep-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="keep-modal" style={{ backgroundColor: note.color || '#fff' }}>
        {/* Image */}
        {imagePreview && (
          <div className="keep-modal-image">
            <img src={imagePreview} alt="" />
            <button 
              className="keep-modal-image-remove" 
              onClick={handleRemoveImage}
              title="Remove image"
            >
              ×
            </button>
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

        {/* Toolbar */}
        <div className="keep-modal-toolbar">
          <div className="keep-modal-tools">
            <button className="keep-modal-tool" onClick={() => { setShowColors(!showColors); setShowLabelPicker(false) }} title="Background options">
              <IoColorPaletteOutline size={18} />
            </button>
            <button 
              className="keep-modal-tool" 
              onClick={() => imageInputRef.current?.click()} 
              disabled={uploading}
              title="Add image"
            >
              <FiImage size={18} />
            </button>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button className="keep-modal-tool" onClick={() => { setShowLabelPicker(!showLabelPicker); setShowColors(false) }} title="Add label">
              <FiTag size={18} />
            </button>
            <button className="keep-modal-tool" onClick={handleArchive} title={note.archived ? 'Unarchive' : 'Archive'}>
              <FiArchive size={18} />
            </button>
            <button className="keep-modal-tool" onClick={handleDelete} title="Delete">
              <FiTrash2 size={18} />
            </button>
          </div>
          <button className="keep-modal-close" onClick={handleSave}>Save</button>
        </div>

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
