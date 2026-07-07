import { useEffect, useMemo, useState } from "react";
import "./App.css";

const recipesKey = "recipe-vault-recipes";
const filtersKey = "recipe-vault-filters";
const themeKey = "recipe-vault-theme";

const blankRecipe = {
  title: "",
  category: "Breakfast",
  tags: "",
  cookingTime: "",
  difficulty: "Easy",
  ingredients: "",
  steps: "",
  imageUrl: "",
  notes: "",
  favorite: false,
};

const starterRecipes = [
  {
    id: 171540001,
    title: "Golden Peach Overnight Oats",
    category: "Breakfast",
    tags: ["healthy", "quick", "meal prep"],
    cookingTime: "10",
    difficulty: "Easy",
    ingredients:
      "Rolled oats, Greek yogurt, milk, peach slices, honey, chia seeds",
    steps:
      "Mix oats, yogurt, milk, and chia seeds. Chill overnight. Top with peach and honey.",
    notes: "Add cinnamon before chilling for a warmer flavor.",
    favorite: true,
    imageUrl:
      "https://minimalistbaker.com/wp-content/uploads/2021/06/Peaches-n-Cream-Overnight-Oats-SQUARE.jpg",
    createdAt: "2026-05-20T09:30:00.000Z",
  },
  {
    id: 171540002,
    title: "Creamy Tomato Basil Pasta",
    category: "Dinner",
    tags: ["comfort", "vegetarian"],
    cookingTime: "30",
    difficulty: "Medium",
    ingredients: "Pasta, tomatoes, garlic, cream, basil, olive oil, parmesan",
    steps:
      "Boil pasta. Cook garlic and tomatoes. Add cream, basil, and pasta. Finish with parmesan.",
    notes: "Save a little pasta water to loosen the sauce.",
    favorite: false,
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-21T12:15:00.000Z",
  },
  {
    id: 171540003,
    title: "Citrus Herb Lunch Bowl",
    category: "Lunch",
    tags: ["fresh", "protein", "bowl"],
    cookingTime: "25",
    difficulty: "Easy",
    ingredients: "Rice, chickpeas, cucumber, orange, herbs, lemon dressing",
    steps:
      "Layer rice and chickpeas. Add chopped cucumber, orange, herbs, and dressing.",
    notes: "Works well as a next-day lunch.",
    favorite: true,
    imageUrl:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=900&q=80",
    createdAt: "2026-05-22T16:45:00.000Z",
  },
];

const defaultFilters = {
  search: "",
  category: "All",
  favoriteOnly: false,
  sort: "newest",
  tag: "All",
};

function getSavedRecipes() {
  const savedRecipes = localStorage.getItem(recipesKey);

  if (!savedRecipes) {
    return starterRecipes;
  }

  return JSON.parse(savedRecipes);
}

function getSavedFilters() {
  const savedFilters = localStorage.getItem(filtersKey);

  if (!savedFilters) {
    return defaultFilters;
  }

  return { ...defaultFilters, ...JSON.parse(savedFilters) };
}

function App() {
  const [recipes, setRecipes] = useState(getSavedRecipes);
  const [filters, setFilters] = useState(getSavedFilters);
  const [form, setForm] = useState(blankRecipe);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem(themeKey) || "light");

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    localStorage.setItem(recipesKey, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(filtersKey, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem(themeKey, theme);
    document.body.dataset.theme = theme;
  }, [theme]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function addRecipe(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.ingredients.trim() || !form.steps.trim()) {
      showToast("Please add title, ingredients, and steps.");
      return;
    }

    const cookingMinutes = Number(form.cookingTime);
    
    if (
      !form.cookingTime ||
      Number.isNaN(cookingMinutes) ||
      cookingMinutes <= 0 ||
      cookingMinutes > 600
    ) {
      showToast("Cooking time must be between 1 and 600 minutes.");
      return;
    }
    const cleanTitle = form.title.trim();

    const newRecipe = {
      ...form,
      title: cleanTitle,
      id: Date.now(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      cookingTime: cookingMinutes,
    };

    setRecipes([newRecipe, ...recipes]);
    setForm(blankRecipe);
    showToast("Recipe added to your vault.");
  }

  function updateRecipe(updatedRecipe) {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe,
      ),
    );
    setEditingRecipe(null);
    showToast("Recipe updated.");
  }

  function deleteRecipe(id) {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
    showToast("Recipe deleted.");
  }

  function toggleFavorite(id) {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe,
      ),
    );
  }

  function resetRecipes() {
    setRecipes(starterRecipes);
    setFilters(defaultFilters);
    showToast("Demo recipes restored.");
  }

  const categories = useMemo(() => {
    return ["All", ...new Set(recipes.map((recipe) => recipe.category))];
  }, [recipes]);

  const allTags = useMemo(() => {
    return ["All", ...new Set(recipes.flatMap((recipe) => recipe.tags))];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        const searchText =
          `${recipe.title} ${recipe.category} ${recipe.tags.join(
            " ",
          )}`.toLowerCase();
        const matchesSearch = searchText.includes(filters.search.toLowerCase());
        const matchesCategory =
          filters.category === "All" || recipe.category === filters.category;
        const matchesFavorite = !filters.favoriteOnly || recipe.favorite;
        const matchesTag =
          filters.tag === "All" || recipe.tags.includes(filters.tag);

        return (
          matchesSearch && matchesCategory && matchesFavorite && matchesTag
        );
      })
      .sort((first, second) => {
        if (filters.sort === "oldest") {
          return new Date(first.createdAt) - new Date(second.createdAt);
        }

        return new Date(second.createdAt) - new Date(first.createdAt);
      });
  }, [recipes, filters]);

  const recipeOfTheDay = recipes.length
    ? recipes[new Date().getDate() % recipes.length]
    : null;

  const recentlyAdded = [...recipes]
    .sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    )
    .slice(0, 3);

  const stats = [
    { label: "Total recipes", value: recipes.length },
    {
      label: "Favorites",
      value: recipes.filter((recipe) => recipe.favorite).length,
    },
    { label: "Categories", value: categories.length - 1 },
  ];

  return (
    <div className="app-shell">
      <Navbar theme={theme} setTheme={setTheme} />
      <HeroSection
        onAddClick={() =>
          document.getElementById("recipe-form").scrollIntoView()
        }
      />

      <main className="layout">
        <aside className="sidebar">
          <RecipeFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            allTags={allTags}
            resetRecipes={resetRecipes}
          />
        </aside>

        <section className="main-content">
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatsCard key={stat.label} stat={stat} />
            ))}
          </div>
          <section className="spotlight-grid">
            <RecipeOfTheDay recipe={recipeOfTheDay} />
            <RecentlyAdded recipes={recentlyAdded} />
          </section>
          <RecipeForm form={form} setForm={setForm} onSubmit={addRecipe} />
           
          {isLoading ? (
            <SkeletonGrid />
          ) : (
            <RecipeList
              recipes={filteredRecipes}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onFavorite={toggleFavorite}
              onEdit={setEditingRecipe}
              onDelete={deleteRecipe}
            />
          )}
        </section>
      </main>

      <button
        className="quick-add"
        type="button"
        onClick={() => document.getElementById("recipe-form").scrollIntoView()}
        aria-label="Quick add recipe"
      >
        +
      </button>

      {editingRecipe && (
        <RecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSave={updateRecipe}
        />
      )}

      <Toast message={toast} />
      <Footer />
    </div>
  );
}

function Navbar({ theme, setTheme }) {
  return (
    <nav className="navbar">
      <div>
        <p className="brand-kicker">Recipe Vault</p>
        <strong>Your calm cooking command center</strong>
      </div>
      <button
        className="theme-toggle"
        type="button"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </nav>
  );
}

function HeroSection({ onAddClick }) {
  return (
    <header className="hero-section">
      <div>
        <p className="eyebrow">Plan, save, and rediscover meals</p>
        <h1>Recipe Vault</h1>
        <p className="hero-copy">
          Build a beautiful local recipe library with favorites, filters, notes,
          and quick meal inspiration.
        </p>
      </div>
      <button className="primary-button" type="button" onClick={onAddClick}>
        Add Recipe
      </button>
    </header>
  );
}

function StatsCard({ stat }) {
  return (
    <article className="stats-card">
      <span>{stat.label}</span>
      <strong>{stat.value}</strong>
    </article>
  );
}

function RecipeForm({ form, setForm, onSubmit }) {
  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <section className="panel form-panel" id="recipe-form">
      <div className="section-heading">
        <p className="eyebrow">New recipe</p>
        <h2>Add something delicious</h2>
      </div>

      <form onSubmit={onSubmit} className="recipe-form">
        <label>
          Recipe title
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Lemon ricotta pancakes"
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Dessert</option>
            <option>Snack</option>
          </select>
        </label>

        <label>
          Tags
          <input
            value={form.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            placeholder="quick, healthy, spicy"
          />
        </label>

        <label>
          Cooking time
          <input
            value={form.cookingTime}
            onChange={(event) => updateField("cookingTime", event.target.value)}
            placeholder="25"
          />
        </label>

        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(event) => updateField("difficulty", event.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>

        <label>
          Optional image URL
          <input
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="wide-field">
          Ingredients
          <textarea
            maxLength="320"
            value={form.ingredients}
            onChange={(event) => updateField("ingredients", event.target.value)}
            placeholder="Add the main ingredients..."
          />
          <span>{form.ingredients.length}/320</span>
        </label>

        <label className="wide-field">
          Steps
          <textarea
            maxLength="520"
            value={form.steps}
            onChange={(event) => updateField("steps", event.target.value)}
            placeholder="Write the cooking steps..."
          />
          <span>{form.steps.length}/520</span>
        </label>

        <label className="wide-field">
          Notes
          <textarea
            maxLength="220"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional tips, substitutions, or reminders..."
          />
          <span>{form.notes.length}/220</span>
        </label>

        <label className="favorite-row">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(event) => updateField("favorite", event.target.checked)}
          />
          Mark as favorite
        </label>

        <button className="primary-button wide-field" type="submit">
          Save Recipe
        </button>
      </form>
    </section>
  );
}

function RecipeFilters({
  filters,
  setFilters,
  categories,
  allTags,
  resetRecipes,
}) {
  function updateFilter(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  return (
    <section className="panel filters-panel">
      <div className="section-heading">
        <p className="eyebrow">Filters</p>
        <h2>Find a recipe</h2>
      </div>

      <label>
        Search recipes
        <input
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search title or tag"
        />
      </label>

      <label>
        Category
        <select
          value={filters.category}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        Sort
        <select
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </label>

      <label className="favorite-row">
        <input
          type="checkbox"
          checked={filters.favoriteOnly}
          onChange={(event) =>
            updateFilter("favoriteOnly", event.target.checked)
          }
        />
        Favorites only
      </label>

      <div>
        <p className="filter-label">Tags</p>
        <div className="tag-filter-list">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={filters.tag === tag ? "tag-chip active" : "tag-chip"}
              type="button"
              onClick={() => updateFilter("tag", tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button className="ghost-button" type="button" onClick={resetRecipes}>
        Reset all recipes
      </button>
    </section>
  );
}

function RecipeList({
  recipes,
  expandedId,
  setExpandedId,
  onFavorite,
  onEdit,
  onDelete,
}) {
  if (recipes.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isExpanded={expandedId === recipe.id}
          onExpand={() =>
            setExpandedId(expandedId === recipe.id ? null : recipe.id)
          }
          onFavorite={() => onFavorite(recipe.id)}
          onEdit={() => onEdit(recipe)}
          onDelete={() => onDelete(recipe.id)}
        />
      ))}
    </section>
  );
}

function RecipeCard({
  recipe,
  isExpanded,
  onExpand,
  onFavorite,
  onEdit,
  onDelete,
}) {
  const image =
    recipe.imageUrl ||
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="recipe-card">
      <div className="image-wrap">
        <img src={image} alt={recipe.title} />
        <FavoriteButton active={recipe.favorite} onClick={onFavorite} />
      </div>

      <div className="recipe-card-body">
        <div className="recipe-title-row">
          <h3>{recipe.title}</h3>
          <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>

        <p className="meta-line">
          {recipe.category} / {recipe.cookingTime || "0"} min
        </p>

        <div className="tag-list">
          {recipe.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {isExpanded && (
          <div className="recipe-details">
            <h4>Ingredients</h4>
            <p>{recipe.ingredients}</p>
            <h4>Steps</h4>
            <p>{recipe.steps}</p>
            {recipe.notes && (
              <>
                <h4>Notes</h4>
                <p>{recipe.notes}</p>
              </>
            )}
          </div>
        )}

        <div className="card-actions">
          <button className="ghost-button" type="button" onClick={onExpand}>
            {isExpanded ? "Collapse" : "Details"}
          </button>
          <button className="ghost-button" type="button" onClick={onEdit}>
            Edit
          </button>
          <button className="danger-button" type="button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function FavoriteButton({ active, onClick }) {
  return (
    <button
      className={active ? "favorite-button active" : "favorite-button"}
      type="button"
      onClick={onClick}
      aria-label="Toggle favorite"
    >
      {active ? "♥" : "♡"}
    </button>
  );
}

function RecipeModal({ recipe, onClose, onSave }) {
  const [draft, setDraft] = useState({
    ...recipe,
    tags: recipe.tags.join(", "),
  });

  function updateDraft(field, value) {
    setDraft({ ...draft, [field]: value });
  }

  function saveEdit(event) {
    event.preventDefault();
    onSave({
      ...draft,
      tags: draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="modal-backdrop">
      <section className="modal">
        <div className="modal-heading">
          <h2>Edit recipe</h2>
          <button type="button" onClick={onClose} aria-label="Close edit modal">
            x
          </button>
        </div>

        <form className="recipe-form" onSubmit={saveEdit}>
          <label>
            Recipe title
            <input
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
            />
          </label>

          <label>
            Category
            <select
              value={draft.category}
              onChange={(event) => updateDraft("category", event.target.value)}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Snack</option>
            </select>
          </label>

          <label>
            Tags
            <input
              value={draft.tags}
              onChange={(event) => updateDraft("tags", event.target.value)}
            />
          </label>

          <label>
            Cooking time
            <input
              value={draft.cookingTime}
              onChange={(event) =>
                updateDraft("cookingTime", event.target.value)
              }
            />
          </label>

          <label>
            Difficulty
            <select
              value={draft.difficulty}
              onChange={(event) =>
                updateDraft("difficulty", event.target.value)
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <label>
            Image URL
            <input
              value={draft.imageUrl}
              onChange={(event) => updateDraft("imageUrl", event.target.value)}
            />
          </label>

          <label className="wide-field">
            Ingredients
            <textarea
              maxLength="320"
              value={draft.ingredients}
              onChange={(event) =>
                updateDraft("ingredients", event.target.value)
              }
            />
            <span>{draft.ingredients.length}/320</span>
          </label>

          <label className="wide-field">
            Steps
            <textarea
              maxLength="520"
              value={draft.steps}
              onChange={(event) => updateDraft("steps", event.target.value)}
            />
            <span>{draft.steps.length}/520</span>
          </label>

          <label className="wide-field">
            Notes
            <textarea
              maxLength="220"
              value={draft.notes}
              onChange={(event) => updateDraft("notes", event.target.value)}
            />
            <span>{draft.notes.length}/220</span>
          </label>

          <label className="favorite-row wide-field">
            <input
              type="checkbox"
              checked={draft.favorite}
              onChange={(event) =>
                updateDraft("favorite", event.target.checked)
              }
            />
            Mark as favorite
          </label>

          <button className="primary-button wide-field" type="submit">
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
}

function RecipeOfTheDay({ recipe }) {
  if (!recipe) {
    return null;
  }

  return (
    <section className="panel recipe-day">
      <p className="eyebrow">Recipe of the day</p>
      <h2>{recipe.title}</h2>
      <p>
        {recipe.category} / {recipe.cookingTime} min / {recipe.difficulty}
      </p>
    </section>
  );
}

function RecentlyAdded({ recipes }) {
  return (
    <section className="panel recent-panel">
      <p className="eyebrow">Recently added</p>
      {recipes.map((recipe) => (
        <div className="recent-item" key={recipe.id}>
          <span>{recipe.title}</span>
          <small>{recipe.category}</small>
        </div>
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <section className="empty-state panel">
      <div className="empty-illustration">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h2>No recipes match your filters</h2>
      <p>Try clearing search, changing category, or adding your next recipe.</p>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <section className="recipe-grid">
      {[1, 2, 3].map((item) => (
        <article className="recipe-card skeleton" key={item}>
          <div></div>
          <span></span>
          <span></span>
          <span></span>
        </article>
      ))}
    </section>
  );
}

function Toast({ message }) {
  return <div className={message ? "toast show" : "toast"}>{message}</div>;
}

function Footer() {
  return (
    <footer className="footer">
      <p>Recipe Vault saves everything in your browser with localStorage.</p>
    </footer>
  );
}

export default App;
