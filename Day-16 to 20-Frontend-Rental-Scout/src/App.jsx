import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import BrowseListingsPage from './pages/BrowseListingsPage'
import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'
import InquiryApplyPage from './pages/InquiryApplyPage'
import NotFoundPage from './pages/NotFoundPage'
import SavedPage from './pages/SavedPage'
import { rentals } from './data/rentals'
import './App.css'

function App() {
  const [savedIds, setSavedIds] = useState(
    rentals.filter((rental) => rental.isSaved).map((rental) => rental.id),
  )

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
                onToggleSave={handleToggleSave}
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
