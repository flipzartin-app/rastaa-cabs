const BADGES = [
  {
    title: "Free cancellation",
    body: "Cancel up to 6 hours before pickup, no questions asked.",
  },
  {
    title: "Pay the driver",
    body: "Pay 20% now to confirm, the rest to your driver on arrival.",
  },
  {
    title: "No hidden fares",
    body: "Every quote includes GST, state tax and toll estimates.",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {BADGES.map((b) => (
        <div
          key={b.title}
          className="border border-roadline rounded-md p-5 bg-roadline/40"
        >
          <p className="font-display text-taxi text-sm mb-2">{b.title}</p>
          <p className="font-body text-steel text-sm leading-relaxed">
            {b.body}
          </p>
        </div>
      ))}
    </div>
  );
}
