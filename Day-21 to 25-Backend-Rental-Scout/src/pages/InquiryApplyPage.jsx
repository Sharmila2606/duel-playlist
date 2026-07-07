import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { rentals } from '../data/rentals'

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  moveInTimeline: "",
  preferredVisitTime: "",
  message: "",
};
 
function validateInquiry(formData) {
  const nextErrors = {}

  if (formData.name.trim().length < 2) {
    nextErrors.name = 'Enter at least 2 characters.'
  }

  if (!formData.email.includes('@') || !formData.email.includes('.')) {
    nextErrors.email = 'Enter a valid email address.'
  }

  if (formData.phone.trim().length < 10) {
    nextErrors.phone = 'Enter a valid contact number.'
  }

  if (formData.preferredVisitTime === "") {
    nextErrors.preferredVisitTime = "Choose your preferred visit time.";
  }

  if (formData.moveInTimeline === "") {
    nextErrors.moveInTimeline = "Choose your move-in timeline.";
  }

  if (formData.message.trim().length < 15) {
    nextErrors.message = 'Write at least 15 characters.'
  }

  return nextErrors
}

function InquiryApplyPage() {
  const { rentalId } = useParams()
  const rental = rentals.find((item) => item.id === rentalId)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (!rental) {
    return (
      <section className="page-section">
        <EmptyState
          title="Rental not found"
          message="This application link does not match any listing in the sample data."
          action={
            <Link className="button primary" to="/listings">
              Back to listings
            </Link>
          }
        />
      </section>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateInquiry(formData)
    setErrors(validationErrors)
    setSubmitError('')

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('http://localhost:4000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rentalId: rental.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors(data.errors || {})
        throw new Error(data.message || 'Could not submit inquiry')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-section form-page">
      <div className="page-heading">
        <p className="eyebrow">Inquiry / Application</p>
        <h1>{rental.title}</h1>
        <p>
          Share your contact details and move-in plan. This form now sends your
          inquiry to the Express backend.
        </p>
      </div>

      {submitted ? (
        <div className="notice success-state">
          <p className="eyebrow">Success</p>
          <h2>Application submitted</h2>
          <p>
            Thanks, {formData.name}. Your inquiry for {rental.title} is
            submitted to the backend.
          </p>
          <div className="action-row">
            <Link className="button primary" to="/listings">
              Back to listings
            </Link>
            <Link className="button secondary" to={`/listings/${rental.id}`}>
              View property again
            </Link>
          </div>
        </div>
      ) : (
        <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
          {submitError && <p className="field-error">{submitError}</p>}

          <label>
            Your name
            <input
              name="name"
              value={formData.name}
              placeholder="Example: Priya Kumar"
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              placeholder="you@example.com"
              onChange={handleChange}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </label>

          <label>
            Contact number
            <input
              name="phone"
              value={formData.phone}
              placeholder="+91 98765 43210"
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </label>

          <label htmlFor="preferredVisitTime">Preferred Visit Time</label>

          <input
            id="preferredVisitTime"
            name="preferredVisitTime"
            type="time"
            value={formData.preferredVisitTime}
            onChange={handleChange}
          />

          {errors.preferredVisitTime && (
            <span className="field-error">{errors.preferredVisitTime}</span>
          )}

          <label>
            Move-in timeline
            <select
              name="moveInTimeline"
              value={formData.moveInTimeline}
              onChange={handleChange}
            >
              <option value="">Select timeline</option>
              <option value="Immediately">Immediately</option>
              <option value="Within 2 weeks">Within 2 weeks</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="Just exploring">Just exploring</option>
            </select>
            {errors.moveInTimeline && (
              <span className="field-error">{errors.moveInTimeline}</span>
            )}
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              placeholder="Ask about visit timing, deposit, room rules, or availability."
              onChange={handleChange}
            />
            {errors.message && (
              <span className="field-error">{errors.message}</span>
            )}
          </label>

          <button className="button primary" type="submit">
            {isSubmitting ? 'Sending...' : 'Send inquiry'}
          </button>
        </form>
      )}
    </section>
  );
}

export default InquiryApplyPage
