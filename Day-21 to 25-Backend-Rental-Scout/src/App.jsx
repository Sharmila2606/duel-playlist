import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from './layouts/MainLayout'
import BrowseListingsPage from './pages/BrowseListingsPage'
import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'
import InquiryApplyPage from './pages/InquiryApplyPage'
import NotFoundPage from './pages/NotFoundPage'
import SavedPage from './pages/SavedPage'
import './App.css'

function App() {
  const [rentals, setRentals] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRentals() {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('http://localhost:4000/api/rentals')

      if (!response.ok) {
        throw new Error('Could not load rentals')
      }

      const data = await response.json()
      setRentals(data)
      setSavedIds(data.filter((rental) => rental.isSaved).map((rental) => rental.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRentals()
  }, [])

  const rentalsWithSavedStatus = rentals.map((rental) => ({
    ...rental,
    isSaved: savedIds.includes(rental.id),
  }))

  function handleToggleSave(rentalId) {
    setSavedIds((currentIds) => {
      if (currentIds.includes(rentalId)) {
        return currentIds.filter((id) => id !== rentalId)
      }

      return [...currentIds, rentalId]
    })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/listings"
            element={
              <BrowseListingsPage
                rentals={rentalsWithSavedStatus}
                isLoading={isLoading}
                error={error}
                onToggleSave={handleToggleSave}
                onRetry={loadRentals}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <SavedPage rentals={rentalsWithSavedStatus} onToggleSave={handleToggleSave} />
            }
          />
          <Route path="/listings/:rentalId" element={<DetailPage />} />
          <Route path="/listings/:rentalId/apply" element={<InquiryApplyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
