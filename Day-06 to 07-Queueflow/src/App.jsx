import { useState } from 'react'
import AddBookForm from './components/AddBookForm'
import EditModal from './components/EditModal'
import FilterBar from './components/FilterBar'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import ReadingGrid from './components/ReadingGrid'
import StatsSection from './components/StatsSection'
import { initialBooks } from './data/initialBooks'

function App() {
  const [books, setBooks] = useState(initialBooks)
  const [activeFilter, setActiveFilter] = useState('All')
  const [editingBook, setEditingBook] = useState(null)

  function handleAddBook(newBook) {
    const bookToAdd = {
      id: Date.now(),
      ...newBook,
      completed: newBook.status === 'Completed',
      accent: 'from-violet-500 to-cyan-400',
    }

    setBooks([bookToAdd, ...books])
  }

  function handleToggleComplete(bookId) {
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              completed: !book.completed,
              status: book.completed ? 'Reading' : 'Completed',
            }
          : book,
      ),
    )
  }

  function handleDeleteBook(bookId) {
    setBooks(books.filter((book) => book.id !== bookId))
  }

  function handleSaveEdit(bookId, updatedBook) {
    setBooks(
      books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              ...updatedBook,
              completed: updatedBook.status === 'Completed',
            }
          : book,
      ),
    )
    setEditingBook(null)
  }

  const filteredBooks =
    activeFilter === 'All' ? books : books.filter((book) => book.status === activeFilter)

  const stats = {
    total: books.length,
    completed: books.filter((book) => book.status === 'Completed').length,
    pending: books.filter((book) => book.status === 'Pending').length,
    reading: books.filter((book) => book.status === 'Reading').length,
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070a12] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.14),transparent_28%)]" />
      <div className="relative">
        <Navbar />
        <HeroSection />
        <StatsSection stats={stats} />
        <AddBookForm onAddBook={handleAddBook} />
        <FilterBar activeFilter={activeFilter} onChangeFilter={setActiveFilter} />
        <ReadingGrid
          books={filteredBooks}
          hasAnyBooks={books.length > 0}
          onToggleComplete={handleToggleComplete}
          onDeleteBook={handleDeleteBook}
          onEditBook={setEditingBook}
        />
      </div>

      {editingBook && (
        <EditModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleSaveEdit}
        />
      )}
    </main>
  )
}

export default App
