export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-road/95 backdrop-blur border-b border-roadline">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-sm bg-taxi flex items-center justify-center font-display text-road text-sm">
            R
          </span>
          <span className="font-display text-paper text-lg tracking-tight">
            RASTAA
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-steel">
          <a href="/#book" className="hover:text-taxi transition-colors">
            Book a cab
          </a>
          <a href="/#fleet" className="hover:text-taxi transition-colors">
            Fleet &amp; fares
          </a>
          <a href="/#routes" className="hover:text-taxi transition-colors">
            Routes
          </a>
          <a href="/#faq" className="hover:text-taxi transition-colors">
            FAQ
          </a>
          <a href="/admin" className="hover:text-taxi transition-colors">
            Admin
          </a>
        </nav>

        <a
          href="/#book"
          className="font-mono text-xs uppercase tracking-widest bg-taxi text-road px-4 py-2 rounded-sm font-bold hover:bg-taxi-dark transition-colors"
        >
          Book now
        </a>
      </div>
    </header>
  );
}
