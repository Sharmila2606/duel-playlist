import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/listings";

const emptyForm = {
  title: "",
  location: "",
  price: "",
  description: "",
  status: "available",
};

function App() {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setValidationError("");
  }

  function validateForm() {
    if (!formData.title.trim()) {
      return "Title is required";
    }

    if (!formData.location.trim()) {
      return "Location is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return "Price must be greater than 0";
    }

    return "";
  }

  async function fetchListings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch listings");
      }

      setListings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function startEdit(listing) {
    setEditingId(listing.id);
    setDeleteId(null);
    setMessage("");
    setError("");
    setValidationError("");
    setFormData({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      description: listing.description || "",
      status: listing.status || "available",
    });
  }

  function cancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const formError = validateForm();

    if (formError) {
      setValidationError(formError);
      return;
    }

    setValidationError("");
    setSaving(true);

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save listing");
      }

      setMessage(editingId ? `Updated: ${data.title}` : `Added: ${data.title}`);
      resetForm();
      fetchListings();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete(id) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete listing");
      }

      setMessage(data.message);
      setDeleteId(null);
      fetchListings();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="admin-shell">
      <header className="page-header">
        <div>
          <h1>Listing Manager</h1>
          <br></br>
          <p>Manage PostgreSQL listing records from one admin screen.</p>
        </div>
        <strong>{listings.length} records</strong>
      </header>

      <section className="admin-layout">
        <form className="panel listing-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Listing" : "Add Listing"}</h2>

          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="2BHK Apartment"
            />
          </label>

          <label>
            Location
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Chennai"
            />
          </label>

          <label>
            Price
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="15000"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Near bus stand"
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
          </label>

          {validationError && <p className="error">{validationError}</p>}
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Listing"
                  : "Add Listing"}
            </button>
            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="panel table-panel">
          <div className="section-heading">
            <h2>Listings</h2>
            <button
              className="secondary-button"
              type="button"
              onClick={fetchListings}
            >
              Refresh
            </button>
          </div>

          {loading && <p className="empty-state">Loading listings...</p>}

          {!loading && listings.length === 0 && (
            <div className="empty-state">
              <h3>No listings yet</h3>
              <p>Add your first listing using the form.</p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>{listing.title}</td>
                      <td>{listing.location}</td>
                      <td>Rs. {listing.price}</td>
                      <td>
                        <span className={`status-pill ${listing.status}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            onClick={() => startEdit(listing)}
                          >
                            Edit
                          </button>
                          <button
                            className="danger-button"
                            type="button"
                            onClick={() => setDeleteId(listing.id)}
                          >
                            Delete
                          </button>
                        </div>

                        {deleteId === listing.id && (
                          <div className="delete-confirmation">
                            <p>Delete this record?</p>
                            <button
                              className="danger-button"
                              type="button"
                              onClick={() => confirmDelete(listing.id)}
                            >
                              Confirm
                            </button>
                            <button
                              className="secondary-button"
                              type="button"
                              onClick={() => setDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
