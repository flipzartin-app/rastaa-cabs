export default function Footer() {
  return (
    <footer className="border-t border-roadline mt-20">
      <div className="max-w-6xl mx-auto px-5 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-paper text-sm mb-2">RASTAA</p>
          <p className="font-body text-steel text-sm leading-relaxed">
            Outstation, local and airport cabs across North India. Booked
            online, confirmed by a real dispatcher.
          </p>
        </div>
        <div className="font-mono text-xs text-steel uppercase tracking-widest flex flex-col gap-2">
          <span className="text-taxi normal-case font-body text-sm mb-1">
            Company
          </span>
          <a href="#" className="hover:text-taxi">
            About
          </a>
          <a href="#" className="hover:text-taxi">
            Driver partners
          </a>
          <a href="#" className="hover:text-taxi">
            Support
          </a>
        </div>
        <div className="font-mono text-xs text-steel uppercase tracking-widest flex flex-col gap-2">
          <span className="text-taxi normal-case font-body text-sm mb-1">
            Legal
          </span>
          <a href="#" className="hover:text-taxi">
            Terms
          </a>
          <a href="#" className="hover:text-taxi">
            Privacy
          </a>
          <a href="#" className="hover:text-taxi">
            Cancellation policy
          </a>
        </div>
      </div>
      <div className="text-center font-mono text-[10px] text-steel/70 pb-6">
        © {new Date().getFullYear()} Rastaa Cabs. Demo project — not a real
        booking service.
      </div>
    </footer>
  );
}
