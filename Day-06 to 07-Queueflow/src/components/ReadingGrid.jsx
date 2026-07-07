import EmptyState from './EmptyState'
import ReadingCard from './ReadingCard'

function ReadingGrid({ books, hasAnyBooks, onToggleComplete, onDeleteBook, onEditBook }) {
  if (books.length === 0) {
    return <EmptyState type={hasAnyBooks ? 'filter' : 'empty'} />
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-12 pt-3 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <ReadingCard
          key={book.id}
          book={book}
          onToggleComplete={onToggleComplete}
          onDeleteBook={onDeleteBook}
          onEditBook={onEditBook}
        />
      ))}
    </section>
  )
}

export default ReadingGrid
