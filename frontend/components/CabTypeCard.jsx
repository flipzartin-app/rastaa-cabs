export default function CabTypeCard({ cab }) {
  return (
    <div className="bg-roadline/60 border border-roadline rounded-md p-5 flex flex-col gap-4 hover:border-taxi/60 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-paper text-base tracking-tight">
            {cab.label}
          </p>
          <p className="font-body text-steel text-xs mt-1">{cab.example}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-taxi border border-taxi/40 rounded-sm px-2 py-1">
          {cab.seats} seats
        </span>
      </div>

      <div className="font-mono text-xs text-steel flex flex-col gap-1">
        <div className="flex justify-between">
          <span>Base fare</span>
          <span className="text-paper tabular-nums">
            ₹{cab.baseFare.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Included</span>
          <span className="text-paper tabular-nums">{cab.baseKm} km</span>
        </div>
        <div className="flex justify-between">
          <span>Extra fare</span>
          <span className="text-paper tabular-nums">₹{cab.perKm}/km</span>
        </div>
      </div>

      <a
        href="#book"
        className="mt-auto text-center font-mono text-[11px] uppercase tracking-widest bg-taxi text-road font-bold rounded-sm py-2 hover:bg-taxi-dark transition-colors"
      >
        Select
      </a>
    </div>
  );
}
