interface NotFoundPageProps {
  isAdmin: boolean;
}

export function NotFoundPage({ isAdmin }: NotFoundPageProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
        404 Error
      </p>

      <h1 className="mt-5 text-5xl font-extrabold text-white">
        Lost?
      </h1>

      <p className="mt-5 max-w-md text-gray-400">
        Looks like this page has disappeared from the lineup.
      </p>

      {isAdmin ? (
        <a
          href="/admin"
          className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
        >
          Back to Admin Dashboard
        </a>
      ) : (
        <a
          href="/"
          className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
        >
          Back to Home
        </a>
      )}
    </section>
  );
}
