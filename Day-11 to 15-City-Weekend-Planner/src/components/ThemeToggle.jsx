function ThemeToggle({ themeMode, onThemeChange }) {
  const isDark = themeMode === 'dark'

  return (
    <button
      aria-pressed={isDark}
      className="theme-toggle"
      type="button"
      onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle
