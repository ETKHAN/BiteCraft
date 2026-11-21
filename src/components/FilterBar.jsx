// Search box plus category, dietary and sort controls.
// The parent owns the values; this component only reports changes through onChange.
function FilterBar({ query, category, diet, sort, categories, diets, onChange }) {
  return (
    <form className="filter-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="field">
        <label htmlFor="search">Search dishes</label>
        <input
          id="search"
          type="search"
          value={query}
          placeholder="Try karahi or wings"
          onChange={(event) => onChange('q', event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(event) => onChange('category', event.target.value)}>
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry.name} value={entry.name}>
              {entry.name} ({entry.count})
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="diet">Dietary</label>
        <select id="diet" value={diet} onChange={(event) => onChange('diet', event.target.value)}>
          <option value="">Any</option>
          {diets.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(event) => onChange('sort', event.target.value)}>
          <option value="">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </form>
  )
}

export default FilterBar
