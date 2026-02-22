import { useState } from 'react'
import { FiPlus, FiX, FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi'
import './EditLabels.css'

export default function EditLabels({ labels, onSave, onClose }) {
  const [editableLabels, setEditableLabels] = useState([...labels])
  const [newLabel, setNewLabel] = useState('')

  function handleAdd() {
    const trimmed = newLabel.trim()
    if (trimmed && !editableLabels.includes(trimmed)) {
      setEditableLabels([...editableLabels, trimmed])
      setNewLabel('')
    }
  }

  function handleDelete(label) {
    setEditableLabels(editableLabels.filter((l) => l !== label))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  function handleDone() {
    onSave(editableLabels)
    onClose()
  }

  return (
    <div className="labels-overlay" onClick={(e) => e.target === e.currentTarget && handleDone()}>
      <div className="labels-modal">
        <h3 className="labels-title">Edit labels</h3>

        <div className="labels-new">
          <button className="labels-icon-btn" onClick={handleAdd}>
            <FiPlus size={18} />
          </button>
          <input
            type="text"
            placeholder="Create new label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            className="labels-input"
            autoFocus
          />
          {newLabel && (
            <button className="labels-icon-btn" onClick={handleAdd}>
              <FiCheck size={18} />
            </button>
          )}
        </div>

        <div className="labels-list">
          {editableLabels.map((label) => (
            <div key={label} className="labels-item">
              <button className="labels-icon-btn" onClick={() => handleDelete(label)}>
                <FiTrash2 size={16} />
              </button>
              <span className="labels-item-text">{label}</span>
            </div>
          ))}
        </div>

        <div className="labels-actions">
          <button className="labels-done" onClick={handleDone}>Done</button>
        </div>
      </div>
    </div>
  )
}
