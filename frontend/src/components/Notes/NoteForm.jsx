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
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const formRef = useRef(null)
  const imageInputRef = useRef(null)

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
  }, [expanded, title, content, pinned, color, image])

  function handleAdd() {
    if (!title.trim() && !content.trim()) return
    onAdd({
      title: title.trim(),
      content: content.trim(),
      pinned,
      color,
      imageFile: image,
      imagePreview: imagePreview
    })
    setTitle('')
    setContent('')
    setPinned(false)
    setColor('#ffffff')
    setShowColors(false)
    setImage(null)
    setImagePreview(null)
  }

  function handleClose() {
    if (title.trim() || content.trim()) {
      onAdd({
        title: title.trim(),
        content: content.trim(),
        pinned,
        color,
        imageFile: image,
        imagePreview: imagePreview
      })
    }
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setContent('')
    setPinned(false)
    setColor('#ffffff')
    setShowColors(false)
    setImage(null)
    setImagePreview(null)
    setExpanded(false)
  }

  function handleQuickSave(e) {
    e.stopPropagation()
    setExpanded(true)
  }

  function handleImageClick(e) {
    e.stopPropagation()
    imageInputRef.current?.click()
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setExpanded(true)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  if (!expanded) {
    return (
      <div className="keep-form-collapsed" onClick={() => setExpanded(true)}>
        <span>Take a note...</span>
        <div className="keep-form-collapsed-icons">
          <button 
            className="keep-collapsed-icon-btn" 
            onClick={handleQuickSave}
            title="New note"
          >
            <FiCheck size={22} color="#5f6368" />
          </button>
          <button 
            className="keep-collapsed-icon-btn" 
            onClick={handleImageClick}
            title="New note with image"
          >
            <FiImage size={22} color="#5f6368" />
          </button>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="keep-form" ref={formRef} style={{ backgroundColor: color }}>
      {imagePreview && (
        <div className="keep-form-image-preview">
          <img src={imagePreview} alt="Note attachment" />
          <button className="keep-form-image-remove" onClick={removeImage} title="Remove image">
            ×
          </button>
        </div>
      )}
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
          <button
            className="keep-toolbar-btn"
            onClick={handleImageClick}
            title="Add image"
          >
            <FiImage size={18} />
          </button>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        <div className="keep-form-action-btns">
          <button className="keep-form-add-btn" onClick={handleAdd}>
            Add
          </button>
          <button className="keep-form-close-btn" onClick={handleClose}>
            Save
          </button>
        </div>
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
