function FormField({
  label,
  name,
  value,
  onChange,
  error,
  theme,
  type = 'text',
  children,
}) {
  const inputClass = `mt-2 w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition duration-300 hover:-translate-y-0.5 focus:shadow-lg focus:shadow-purple-400/10 ${theme.input}`

  return (
    <label className={`block text-sm font-semibold ${theme.labelText}`}>
      {label}

      {children ? (
        <select name={name} value={value} onChange={onChange} className={`${inputClass} cursor-pointer`}>
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}

      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  )
}

export default FormField
