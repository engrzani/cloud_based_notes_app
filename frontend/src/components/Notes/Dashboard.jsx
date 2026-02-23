import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Layout/Header'
import Sidebar from '../Layout/Sidebar'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'
import NoteModal from './NoteModal'
import EditLabels from './EditLabels'
import './Dashboard.css'

export default function Dashboard() {
  const { currentUser } = useAuth()
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [activeView, setActiveView] = useState('notes')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showEditLabels, setShowEditLabels] = useState(false)
  const [labels, setLabels] = useState([])

  // Load labels from localStorage
  useEffect(() => {
    if (!currentUser) return
    const saved = localStorage.getItem(`labels-${currentUser.uid}`)
    if (saved) setLabels(JSON.parse(saved))
  }, [currentUser])

  function saveLabels(newLabels) {
    setLabels(newLabels)
    localStorage.setItem(`labels-${currentUser.uid}`, JSON.stringify(newLabels))
  }

  // Real-time notes listener
  useEffect(() => {
    if (!currentUser) return

    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', currentUser.uid),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
        setNotes(notesData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching notes:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  async function handleAddNote({ title, content, pinned, color, image }) {
    try {
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        color: color || '#ffffff',
        pinned: pinned || false,
        archived: false,
        trashed: false,
        labels: [],
        image: image || null,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  async function handleUpdateNote(noteId, updates) {
    try {
      const noteRef = doc(db, 'notes', noteId)
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      // Update selected note if open
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote((prev) => ({ ...prev, ...updates }))
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      await deleteDoc(doc(db, 'notes', noteId))
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // Filter notes based on active view
  function getFilteredNotes() {
    let filtered = notes

    // View filters
    switch (activeView) {
      case 'notes':
        filtered = filtered.filter((n) => !n.archived && !n.trashed)
        break
      case 'archive':
        filtered = filtered.filter((n) => n.archived && !n.trashed)
        break
      case 'trash':
        filtered = filtered.filter((n) => n.trashed)
        break
      case 'reminders':
        filtered = filtered.filter((n) => !n.archived && !n.trashed && n.reminder)
        break
      default:
        if (activeView.startsWith('label-')) {
          const label = activeView.replace('label-', '')
          filtered = filtered.filter((n) => !n.archived && !n.trashed && n.labels && n.labels.includes(label))
        }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((n) =>
        n.title?.toLowerCase().includes(term) ||
        n.content?.toLowerCase().includes(term)
      )
    }

    return filtered
  }

  const filteredNotes = getFilteredNotes()
  const pinnedNotes = filteredNotes.filter((n) => n.pinned)
  const otherNotes = filteredNotes.filter((n) => !n.pinned)
  const showPinnedSection = activeView === 'notes' && pinnedNotes.length > 0 && otherNotes.length > 0

  function getViewTitle() {
    switch (activeView) {
      case 'notes': return ''
      case 'reminders': return 'Reminders'
      case 'archive': return 'Archive'
      case 'trash': return 'Trash'
      default:
        if (activeView.startsWith('label-')) return activeView.replace('label-', '')
        return ''
    }
  }

  function getEmptyMessage() {
    switch (activeView) {
      case 'notes': return { icon: '📝', title: 'Notes you add appear here' }
      case 'reminders': return { icon: '🔔', title: 'Notes with reminders appear here' }
      case 'archive': return { icon: '📦', title: 'Your archived notes appear here' }
      case 'trash': return { icon: '🗑️', title: 'No notes in Trash' }
      default: return { icon: '🏷️', title: 'No notes with this label yet' }
    }
  }

  return (
    <div className="keep-app">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <Sidebar
        expanded={sidebarExpanded}
        activeView={activeView}
        onViewChange={(view) => { setActiveView(view); setSidebarExpanded(false) }}
        labels={labels}
        onEditLabels={() => setShowEditLabels(true)}
      />

      <main className={`keep-main ${sidebarExpanded ? 'sidebar-open' : ''}`}>
        {/* View title */}
        {getViewTitle() && (
          <h2 className="keep-view-title">{getViewTitle()}</h2>
        )}

        {/* Note form (only on notes view) */}
        {activeView === 'notes' && <NoteForm onAdd={handleAddNote} />}

        {/* Trash notice */}
        {activeView === 'trash' && filteredNotes.length > 0 && (
          <div className="keep-trash-notice">
            Notes in Trash are deleted after 7 days.
          </div>
        )}

        {loading ? (
          <div className="keep-loading">
            <div className="spinner"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="keep-empty">
            <span className="keep-empty-icon">{getEmptyMessage().icon}</span>
            <p className="keep-empty-text">{getEmptyMessage().title}</p>
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {showPinnedSection && (
              <>
                <p className="keep-section-label">PINNED</p>
                <div className={`keep-notes ${viewMode}`}>
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onUpdate={handleUpdateNote}
                      onDelete={handleDeleteNote}
                      onClick={setSelectedNote}
                      activeView={activeView}
                    />
                  ))}
                </div>
                <p className="keep-section-label">OTHERS</p>
              </>
            )}

            {/* Main / Others notes */}
            <div className={`keep-notes ${viewMode}`}>
              {(showPinnedSection ? otherNotes : filteredNotes).map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                  onClick={setSelectedNote}
                  activeView={activeView}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Note edit modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          onClose={() => setSelectedNote(null)}
          labels={labels}
        />
      )}

      {/* Edit labels modal */}
      {showEditLabels && (
        <EditLabels
          labels={labels}
          onSave={saveLabels}
          onClose={() => setShowEditLabels(false)}
        />
      )}
    </div>
  )
}
