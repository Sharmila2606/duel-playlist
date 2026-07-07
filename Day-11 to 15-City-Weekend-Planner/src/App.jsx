import { useEffect, useState } from 'react'
import EmptyState from './components/EmptyState'
import FilterControls from './components/FilterControls'
import PlaceCard from './components/PlaceCard'
import PlannerSummary from './components/PlannerSummary'
import ThemeToggle from './components/ThemeToggle'
import Toast from './components/Toast'
import WeekendPlan from './components/WeekendPlan'
import { places } from './data/places'
import './styles/App.css'

const categories = ['All', 'Food', 'Outdoors', 'Culture', 'Shopping']
const savedPlanKey = 'city-weekend-planner-ids'
const savedNotesKey = 'city-weekend-planner-notes'

function getSavedValue(key, fallbackValue) {
  try {
    const savedValue = localStorage.getItem(key)

    if (!savedValue) {
      return fallbackValue
    }

    return JSON.parse(savedValue)
  } catch {
    return fallbackValue
  }
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [themeMode, setThemeMode] = useState('light')
  const [toastMessage, setToastMessage] = useState('')
  const [showBudgetOnly, setShowBudgetOnly] = useState(false)
  const [plannedPlaceIds, setPlannedPlaceIds] = useState(() =>
    getSavedValue(savedPlanKey, []),
  )
  const [planNotes, setPlanNotes] = useState(() =>
    getSavedValue(savedNotesKey, {}),
  )

  useEffect(() => {
    localStorage.setItem(savedPlanKey, JSON.stringify(plannedPlaceIds))
  }, [plannedPlaceIds])

  useEffect(() => {
    localStorage.setItem(savedNotesKey, JSON.stringify(planNotes))
  }, [planNotes])

  const filteredPlaces = places.filter((place) => {
    const searchValue = searchText.toLowerCase()
    const matchesSearch =
      place.name.toLowerCase().includes(searchValue) ||
      place.area.toLowerCase().includes(searchValue) ||
      place.description.toLowerCase().includes(searchValue)

    const matchesBudgetFilter =
      !showBudgetOnly || place.cost === 'Free' || place.cost === '$'

    const matchesCategory =
      selectedCategory === 'All' || place.category === selectedCategory

    const matchesFreeFilter = !showFreeOnly || place.cost === 'Free'

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFreeFilter &&
      matchesBudgetFilter
    )
  })

  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === 'ratingHigh') {
      return Number(b.rating) - Number(a.rating)
    }

    if (sortBy === 'ratingLow') {
      return Number(a.rating) - Number(b.rating)
    }

    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }

    if (sortBy === 'freeFirst') {
      return Number(b.cost === 'Free') - Number(a.cost === 'Free')
    }

    return 0
  })

  const plannedPlaces = places.filter((place) =>
    plannedPlaceIds.includes(place.id),
  )

  function showToast(message) {
    setToastMessage(message)
    window.setTimeout(() => {
      setToastMessage('')
    }, 2200)
  }

  function handleTogglePlan(placeId) {
    const selectedPlace = places.find((place) => place.id === placeId)

    if (plannedPlaceIds.includes(placeId)) {
      setPlannedPlaceIds(plannedPlaceIds.filter((id) => id !== placeId))
      setPlanNotes((currentNotes) => {
        const nextNotes = { ...currentNotes }
        delete nextNotes[placeId]
        return nextNotes
      })
      showToast(`${selectedPlace.name} removed from your plan`)
    } else {
      setPlannedPlaceIds([...plannedPlaceIds, placeId])
      showToast(`${selectedPlace.name} added to your plan`)
    }
  }

  function handleNoteChange(placeId, noteText) {
    setPlanNotes((currentNotes) => ({
      ...currentNotes,
      [placeId]: noteText,
    }))
  }

  function handleResetFilters() {
    setSearchText('')
    setSelectedCategory('All')
    setShowFreeOnly(false)
    setShowBudgetOnly(false)
    setSortBy('default')
    showToast('Filters reset')
  }

  function handleClearPlan() {
    setPlannedPlaceIds([])
    
    setPlanNotes({})
    showToast('Weekend plan cleared')
  }

  function handleResetApp() {
    setSearchText('')
    setSelectedCategory('All')
    setShowFreeOnly(false)
    setShowBudgetOnly(false)
    setSortBy('default')
    setPlannedPlaceIds([])
    setPlanNotes({})
    showToast('App reset')
  }

  const activeFilterCount =
    Number(searchText.trim() !== '') +
    Number(selectedCategory !== 'All') +
    Number(showFreeOnly) +
    Number(showBudgetOnly) +
    Number(sortBy !== 'default')

  return (
    <main className={`app ${themeMode}`}>
      <section className="hero">
        <div>
          <p className="eyebrow">Weekend plan builder</p>
          <h1>City Weekend Planner</h1>
          <p className="intro">
            Search local places, filter by mood, and save a simple plan for your
            next free weekend.
          </p>
        </div>

        <div className="hero-actions">
          <ThemeToggle themeMode={themeMode} onThemeChange={setThemeMode} />
          <PlannerSummary
            plannedCount={plannedPlaces.length}
            resultCount={filteredPlaces.length}
            noteCount={Object.keys(planNotes).length}
          />
        </div>
      </section>

      <FilterControls
        categories={categories}
        searchText={searchText}
        selectedCategory={selectedCategory}
        showFreeOnly={showFreeOnly}
        showBudgetOnly={showBudgetOnly}
        sortBy={sortBy}
        onSearchChange={setSearchText}
        onCategoryChange={setSelectedCategory}
        onFreeOnlyChange={setShowFreeOnly}
        onBudgetOnlyChange={setShowBudgetOnly}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      <WeekendPlan
        plannedPlaces={plannedPlaces}
        planNotes={planNotes}
        onClearPlan={handleClearPlan}
        onNoteChange={handleNoteChange}
        onRemovePlace={handleTogglePlan}
        onResetApp={handleResetApp}
      />

      {filteredPlaces.length > 0 ? (
        <section className="places-grid" aria-label="Place results">
          {sortedPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isPlanned={plannedPlaceIds.includes(place.id)}
              onTogglePlan={handleTogglePlan}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No places found"
          message="Try a different search word, category, or filter setting."
        />
      )}

      <Toast message={toastMessage} />
    </main>
  )
}

export default App
