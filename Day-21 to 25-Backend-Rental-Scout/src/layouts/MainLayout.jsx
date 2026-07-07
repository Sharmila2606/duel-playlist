import { NavLink, Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="app-shell">
      <header className="site-header"> 
        <NavLink className="brand" to="/">
          Rental Scout
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/listings">Browse Listings</NavLink>
          <NavLink to="/saved">Saved</NavLink>
        </nav>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
