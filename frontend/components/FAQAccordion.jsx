import { useState } from "react";

const FAQS = [
  {
    q: "How many cab types can I choose from?",
    a: "Five: Hatchback, Sedan, SUV, Prime Sedan and Prime SUV. Each shows its included kilometres and extra-km rate up front.",
  },
  {
    q: "What's included in the quoted price?",
    a: "GST, state tax and a toll estimate are baked into every fare shown on this site. Parking and interstate permit charges, where applicable, are paid directly to the driver.",
  },
  {
    q: "Can I book a round trip or an hourly local package?",
    a: "Yes — use the trip-type tabs above the search form to switch between outstation one-way, round trip, local/hourly and airport transfers.",
  },
  {
    q: "How is the fare calculated?",
    a: "A base fare covers the included kilometres for your cab type. Distance beyond that is charged at the per-kilometre rate shown on the fleet card, calculated by our fare engine at booking time.",
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-roadline border border-roadline rounded-md">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-body text-paper text-sm font-medium">
                {f.q}
              </span>
              <span className="font-mono text-taxi text-lg leading-none">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-4 font-body text-steel text-sm leading-relaxed">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
