export default function RouteTable({ routes }) {
  return (
    <div className="overflow-x-auto rounded-md border border-roadline">
      <table className="w-full text-left border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-roadline/60 font-mono text-[10px] uppercase tracking-widest text-steel">
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">Distance</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3 text-right">Starting fare</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r, i) => (
            <tr
              key={`${r.from}-${r.to}-${i}`}
              className="border-t border-roadline font-body text-sm text-paper"
            >
              <td className="px-4 py-3">
                {r.from} <span className="text-steel">→</span> {r.to}
              </td>
              <td className="px-4 py-3 font-mono text-steel">{r.km} km</td>
              <td className="px-4 py-3 font-mono text-steel">{r.hours}</td>
              <td className="px-4 py-3 font-mono text-right text-meter tabular-nums">
                ₹{r.fare.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-right">
                <a
                  href="#book"
                  className="font-mono text-[10px] uppercase tracking-widest text-taxi hover:underline"
                >
                  Book
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
