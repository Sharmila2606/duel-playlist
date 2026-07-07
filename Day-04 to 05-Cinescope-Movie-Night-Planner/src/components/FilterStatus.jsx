function FilterStatus({ activeGenre, searchTerm }) {
  const hasGenre = activeGenre !== "All";
  const hasSearch = searchTerm !== "";

  if (!hasGenre && !hasSearch) {
    return null;
  }

  return (
    <p className="mt-3 text-sm font-semibold text-white/45">
      {hasGenre && `Filtering by ${activeGenre}`}
      {hasGenre && hasSearch && " - "}
      {hasSearch && `Search: ${searchTerm}`}
    </p>
  );
}

export default FilterStatus;
