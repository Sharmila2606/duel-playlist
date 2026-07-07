import { useState } from 'react'
import FormField from '../components/FormField'
import TicketPreview from '../components/TicketPreview'

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  workshopType: '',
  ticketCategory: '',
}

const themes = {
  dark: {
    label: 'Dark',
    page: 'from-black via-zinc-950 to-purple-950 text-white',
    bodyText: 'text-zinc-300',
    labelText: 'text-zinc-200',
    softText: 'text-purple-200',
    button: 'bg-purple-300 hover:bg-purple-200',
    input: 'border-purple-300/20 bg-black/40 text-white placeholder:text-zinc-500 focus:border-purple-300 focus:bg-black/60',
    formPanel: 'border-purple-300/20 bg-black/40 shadow-purple-950/40',
    ticketPanel: 'border-purple-300/25 bg-black/45 shadow-purple-950/40 hover:bg-black/60',
    themeBox: 'border-white/10 bg-black/40',
    cardBorder: 'border-purple-300/25',
    cardLabel: 'text-zinc-400',
    cardValue: 'text-white',
    successBox: 'border-purple-300/40 bg-purple-400/10 text-purple-100',
    buttonShadow: 'shadow-purple-500/20',
    avatarShadow: 'shadow-purple-500/30',
  },
  light: {
    label: 'White',
    page: 'from-white via-purple-50 to-fuchsia-100 text-zinc-950',
    bodyText: 'text-zinc-600',
    labelText: 'text-zinc-700',
    softText: 'text-purple-700',
    button: 'bg-purple-300 hover:bg-purple-200',
    input: 'border-purple-700/20 bg-white/90 text-zinc-950 placeholder:text-zinc-400 focus:border-purple-600 focus:bg-white',
    formPanel: 'border-purple-700/15 bg-white/85 shadow-purple-900/10',
    ticketPanel: 'border-purple-700/15 bg-white/85 shadow-purple-900/10 hover:bg-white',
    themeBox: 'border-purple-700/10 bg-white/80',
    cardBorder: 'border-purple-700/15',
    cardLabel: 'text-zinc-500',
    cardValue: 'text-zinc-950',
    successBox: 'border-purple-600/25 bg-purple-200/70 text-purple-900',
    buttonShadow: 'shadow-purple-700/10',
    avatarShadow: 'shadow-purple-700/20',
  },
}

function WorkshopPage() {
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [themeName, setThemeName] = useState('dark')
  const [ticket, setTicket] = useState({
    name: '',
    phone: '',
    category: '',
    id: '',
    date: '',
    time: '',
  })

  const theme = themes[themeName]
  const previewTicket = {
    name: ticket.name || formData.fullName,
    phone: ticket.phone || formData.phone,
    workshop: formData.workshopType || 'Choose workshop',
    category: ticket.category || formData.ticketCategory,
    id: ticket.id,
    date: ticket.date,
    time: ticket.time,
  }

  function handleChange(event) {
    const { name, value } = event.target

    setSuccessMessage('')

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function validateForm() {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      nextErrors.email = 'Email must include @ and .'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required'
    } else if (formData.phone.trim().length < 10) {
      nextErrors.phone = 'Enter at least 10 digits'
    }

    if (!formData.workshopType) {
      nextErrors.workshopType = 'Choose a workshop type'
    }

    if (!formData.ticketCategory) {
      nextErrors.ticketCategory = 'Choose a ticket category'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage('')
      return
    }

    const submittedAt = new Date()

    setTicket({
      name: formData.fullName,
      phone: formData.phone,
      category: formData.ticketCategory,
      id: `PASS-${submittedAt.getTime().toString().slice(-6)}`,
      date: submittedAt.toLocaleDateString(),
      time: submittedAt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })

    setSuccessMessage('Registration successful. Your ticket is ready.')
    setFormData(emptyForm)
  }

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${theme.page} px-4 py-8 font-sans transition-colors duration-500 sm:px-6 lg:px-8`}
    >
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Creative Event Pass Generator
          </h1>
          <p className={`mt-4 max-w-2xl text-lg leading-8 ${theme.bodyText}`}>
            Create Your Personalized Event pass with live
          </p>

          <div className="mt-6 max-w-xs">
            <label className={`block text-sm font-medium ${theme.labelText}`}>
              Theme
              <select
                value={themeName}
                onChange={(event) => setThemeName(event.target.value)}
                className={`mt-2 w-full cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition duration-300 hover:-translate-y-0.5 ${theme.input}`}
              >
                {Object.entries(themes).map(([name, themeOption]) => (
                  <option key={name} value={name}>
                    {themeOption.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`mt-8 rounded-3xl border p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 sm:p-6 ${theme.formPanel}`}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                theme={theme}
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                theme={theme}
              />

              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                theme={theme}
              />

              <FormField
                label="Workshop type"
                name="workshopType"
                value={formData.workshopType}
                onChange={handleChange}
                error={errors.workshopType}
                theme={theme}
              >
                <option value="">Select workshop</option>
                <option value="React Basics">React Basics</option>
                <option value="UI Design">UI Design</option>
                <option value="Frontend Career">Frontend Career</option>
                <option value="AI Product Design">AI Product Design</option>
              </FormField>

              <FormField
                label="Ticket category"
                name="ticketCategory"
                value={formData.ticketCategory}
                onChange={handleChange}
                error={errors.ticketCategory}
                theme={theme}
              >
                <option value="">Select category</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="VIP">VIP</option>
                <option value="Early Bird">Early Bird</option>
              </FormField>
            </div>

            {successMessage && (
              <div
                className={`animate-success-pop mt-5 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg shadow-purple-500/10 ${theme.successBox}`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-purple-300 text-xs font-bold text-black">
                  OK
                </span>
                <p>{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              className={`mt-6 w-full rounded-2xl px-5 py-4 font-bold text-black shadow-xl ${theme.buttonShadow} transition duration-300 hover:-translate-y-1 hover:shadow-purple-400/30 ${theme.button}`}
            >
              Create My Event Pass
            </button>
          </form>
        </div>

        <TicketPreview ticket={previewTicket} theme={theme} isReady={Boolean(ticket.id)} />
      </section>
    </main>
  )
}

export default WorkshopPage
