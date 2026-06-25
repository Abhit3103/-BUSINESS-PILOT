export function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="mb-5 border-b border-zinc-800 pb-4">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
