// Reusable box for "nothing here" situations: a title, an explanation and a next action.
function EmptyState({ title, children }) {
  return (
    <section className="state-box">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default EmptyState
