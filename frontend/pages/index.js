import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchWidget from "../components/SearchWidget";
import CabTypeCard from "../components/CabTypeCard";
import RouteTable from "../components/RouteTable";
import TrustBadges from "../components/TrustBadges";
import FAQAccordion from "../components/FAQAccordion";
import { CAB_TYPES, POPULAR_ROUTES } from "../lib/data";

export default function Home() {
  return (
    <div id="top" className="bg-road min-h-screen">
      <Head>
        <title>Rastaa Cabs — Outstation, local &amp; airport taxi booking</title>
        <meta
          name="description"
          content="Book outstation, local and airport cabs with upfront, meter-clear pricing."
        />
      </Head>

      <Header />

      <section className="relative overflow-hidden pt-16 pb-28">
        <div
          className="absolute inset-x-0 top-1/2 h-[2px] bg-dash-line opacity-20"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto text-center px-5">
          <p className="font-mono text-taxi text-xs uppercase tracking-[0.3em] mb-4">
            Upfront fares · No surge · No surprises
          </p>
          <h1 className="font-display text-paper text-4xl md:text-6xl leading-tight tracking-tight">
            Every fare, metered
            <br />
            before you get in.
          </h1>
          <p className="font-body text-steel text-base md:text-lg mt-5 max-w-xl mx-auto">
            Outstation, local and airport cabs across North India. Pick a
            cab type, watch the meter settle on your price, and confirm in
            under a minute.
          </p>
        </div>
      </section>

      <SearchWidget />

      <section id="fleet" className="max-w-6xl mx-auto px-5 pt-24 pb-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-paper text-2xl">Fleet &amp; fares</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-steel">
            5 cab types
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAB_TYPES.map((cab) => (
            <CabTypeCard key={cab.id} cab={cab} />
          ))}
        </div>
      </section>

      <section id="routes" className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <h2 className="font-display text-paper text-2xl mb-6">
          Popular routes
        </h2>
        <RouteTable routes={POPULAR_ROUTES} />
      </section>

      <section className="max-w-6xl mx-auto px-5 pt-20 pb-6">
        <h2 className="font-display text-paper text-2xl mb-6">
          Why book with us
        </h2>
        <TrustBadges />
      </section>

      <section id="faq" className="max-w-4xl mx-auto px-5 pt-20 pb-24">
        <h2 className="font-display text-paper text-2xl mb-6">
          Frequently asked questions
        </h2>
        <FAQAccordion />
      </section>

      <Footer />
    </div>
  );
}
