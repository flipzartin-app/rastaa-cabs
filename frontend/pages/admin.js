import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminAuthGate2 from "../components/AdminAuthGate2";

export default function AdminPage() {
  return (
    <div className="bg-road min-h-screen">
      <Head>
        <title>Admin | Rastaa Cabs</title>
        <meta name="description" content="Admin panel for reviewing and confirming taxi bookings" />
      </Head>

      <Header />

      <main className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-taxi">Admin access</p>
          <h1 className="font-display text-paper text-3xl md:text-4xl mt-2">Manage bookings</h1>
          <p className="text-steel mt-3 max-w-2xl">
            Review each booking request, inspect rider details, and confirm or cancel pending reservations from one dashboard.
          </p>
        </div>

        <AdminAuthGate2 />
      </main>

      <Footer />
    </div>
  );
}
