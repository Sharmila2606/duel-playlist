import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const AUTH_API_URL = "http://localhost:5000/api";

function getSavedAuth() {
  const savedAuth = localStorage.getItem("auth");

  if (!savedAuth) {
    return { user: null, token: "" };
  }

  return JSON.parse(savedAuth);
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function NavBar({ user, onLogout }) {
  return (
    <nav className="nav-bar">
      <Link to="/">Listing Manager</Link>

      <div className="nav-actions">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span>{user.name}</span>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <section className="panel page-panel">
      <h1>Private Saved Listings</h1>
      <p>
        This public page is open to everyone. Login is needed only for private
        screens like the dashboard.
      </p>
      <Link className="button-link" to="/dashboard">
        Open Dashboard
      </Link>
    </section>
  );
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      onLogin(data.user, data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <h1>Login</h1>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function SignupPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to signup");
      }

      onLogin(data.user, data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <h1>Signup</h1>

      <label>
        Name
        <input name="name" value={formData.name} onChange={handleChange} />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Signup"}
      </button>
    </form>
  );
}

function DashboardPage({ user, token }) {
  const [currentUser, setCurrentUser] = useState(user);
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiryForm, setInquiryForm] = useState({
    listingId: "",
    message: "",
  });
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [editInquiryForm, setEditInquiryForm] = useState({
    message: "",
    status: "open",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch(`${AUTH_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load current user");
        }

        setCurrentUser(data.user);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchCurrentUser();
  }, [token]);

  async function fetchListings() {
    try {
      const response = await fetch(`${AUTH_API_URL}/listings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load listings");
      }

      setListings(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function fetchSavedListings() {
    try {
      const response = await fetch(`${AUTH_API_URL}/saved-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load saved listings");
      }

      setSavedListings(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function fetchInquiries() {
    try {
      const response = await fetch(`${AUTH_API_URL}/inquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load inquiries");
      }

      setInquiries(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchListings();
    fetchSavedListings();
    fetchInquiries();
  }, [token]);

  async function saveListing(listingId) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${AUTH_API_URL}/saved-listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save listing");
      }

      setMessage(data.message);
      fetchSavedListings();
    } catch (error) {
      setError(error.message);
    }
  }

  async function removeSavedListing(listingId) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${AUTH_API_URL}/saved-listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove saved listing");
      }

      setMessage(data.message);
      fetchSavedListings();
    } catch (error) {
      setError(error.message);
    }
  }

  function isSaved(listingId) {
    return savedListings.some((listing) => listing.id === listingId);
  }

  function handleInquiryChange(event) {
    const { name, value } = event.target;

    setInquiryForm({
      ...inquiryForm,
      [name]: value,
    });
  }

  async function createInquiry(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${AUTH_API_URL}/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inquiryForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create inquiry");
      }

      setMessage(data.message);
      setInquiryForm({ listingId: "", message: "" });
      fetchInquiries();
    } catch (error) {
      setError(error.message);
    }
  }

  async function deleteInquiry(inquiryId) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${AUTH_API_URL}/inquiries/${inquiryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete inquiry");
      }

      setMessage(data.message);
      fetchInquiries();
    } catch (error) {
      setError(error.message);
    }
  }

  function startEditInquiry(inquiry) {
    setEditingInquiryId(inquiry.id);
    setEditInquiryForm({
      message: inquiry.message,
      status: inquiry.status,
    });
  }

  function cancelEditInquiry() {
    setEditingInquiryId(null);
    setEditInquiryForm({
      message: "",
      status: "open",
    });
  }

  function handleEditInquiryChange(event) {
    const { name, value } = event.target;

    setEditInquiryForm({
      ...editInquiryForm,
      [name]: value,
    });
  }

  async function updateInquiry(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${AUTH_API_URL}/inquiries/${editingInquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editInquiryForm),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update inquiry");
      }

      setMessage(data.message);
      cancelEditInquiry();
      fetchInquiries();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="panel dashboard-panel">
      <h1>Private Dashboard</h1>
      <p>Only logged-in users can see this page.</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {currentUser && (
        <div className="user-box">
          <p>Name: {currentUser.name}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      )}

      <div className="dashboard-grid">
        <section>
          <h2>All Listings</h2>
          {listings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p>Rs. {listing.price}</p>
              <button
                type="button"
                disabled={isSaved(listing.id)}
                onClick={() => saveListing(listing.id)}
              >
                {isSaved(listing.id) ? "Saved" : "Save"}
              </button>
            </article>
          ))}
        </section>

        <section>
          <h2>My Saved Listings</h2>
          {savedListings.length === 0 && (
            <p className="empty-state">No saved listings yet.</p>
          )}

          {savedListings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p>Rs. {listing.price}</p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => removeSavedListing(listing.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </section>
      </div>

      <section className="inquiry-section">
        <h2>My Inquiries</h2>

        <form className="inquiry-form" onSubmit={createInquiry}>
          <label>
            Listing
            <select
              name="listingId"
              value={inquiryForm.listingId}
              onChange={handleInquiryChange}
            >
              <option value="">Choose a listing</option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={inquiryForm.message}
              onChange={handleInquiryChange}
              placeholder="Ask about this listing"
            />
          </label>

          <button type="submit">Create Inquiry</button>
        </form>

        {inquiries.length === 0 && (
          <p className="empty-state">No inquiries yet.</p>
        )}

        {inquiries.map((inquiry) => (
          <article className="listing-card" key={inquiry.id}>
            <h3>{inquiry.listing_title}</h3>
            {editingInquiryId === inquiry.id ? (
              <form className="edit-inquiry-form" onSubmit={updateInquiry}>
                <label>
                  Message
                  <textarea
                    name="message"
                    value={editInquiryForm.message}
                    onChange={handleEditInquiryChange}
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={editInquiryForm.status}
                    onChange={handleEditInquiryChange}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>

                <div className="row-actions">
                  <button type="submit">Update Inquiry</button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={cancelEditInquiry}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>{inquiry.message}</p>
                <p>Status: {inquiry.status}</p>
                <div className="row-actions">
                  <button
                    type="button"
                    onClick={() => startEditInquiry(inquiry)}
                  >
                    Edit Inquiry
                  </button>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => deleteInquiry(inquiry.id)}
                  >
                    Delete Inquiry
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </section>
    </section>
  );
}

function App() {
  const [auth, setAuth] = useState(getSavedAuth);

  function handleLogin(user, token) {
    const nextAuth = { user, token };

    localStorage.setItem("auth", JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: "" });
  }

  return (
    <main className="admin-shell">
      <NavBar user={auth.user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={auth.user}>
              <DashboardPage user={auth.user} token={auth.token} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
