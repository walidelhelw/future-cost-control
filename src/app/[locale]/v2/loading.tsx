export default function V2Loading() {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-3 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className="h-28 animate-pulse rounded-md border border-white/10 bg-white/[0.04]"
            key={index}
          />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-md border border-cyan-300/20 bg-cyan-300/10" />
      <div className="h-[520px] animate-pulse rounded-md border border-white/10 bg-white/[0.04]" />
    </div>
  );
}
