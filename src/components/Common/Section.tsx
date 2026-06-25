export default function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>}
      </div>
      {children}
    </section>
  );
}
