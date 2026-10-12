
function Loading() {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] py-4"
      role="status"
      aria-label="Loading movies and TV series"
    >
      <div className="mb-8">
        <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-white/10" />

        {/* Featured banner placeholder */}
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#15151f] sm:min-h-[360px]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-950/40 via-white/[0.03] to-transparent" />

          <div className="relative flex min-h-[280px] flex-col justify-end gap-4 p-6 sm:min-h-[360px] sm:p-10">
            <div className="h-5 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-9 w-3/4 max-w-lg animate-pulse rounded-lg bg-white/10 sm:h-12" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-white/[0.07]" />
            <div className="h-4 w-2/3 max-w-sm animate-pulse rounded bg-white/[0.07]" />
            <div className="mt-2 h-12 w-36 animate-pulse rounded-xl bg-purple-500/20" />
          </div>
        </div>
      </div>

      {/* Skeleton poster rows */}
      {[1, 2].map((row) => (
        <div key={row} className="mb-10">
          <div className="mb-5 h-7 w-52 animate-pulse rounded-lg bg-white/10" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-white/[0.05] bg-[#15151f]"
              >
                {/* Poster placeholder */}
                <div className="aspect-[2/3] animate-pulse bg-gradient-to-br from-gray-800 via-gray-700/70 to-gray-800" />

                {/* Text placeholders */}
                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.07]" />

                  <div className="flex items-center justify-between pt-1">
                    <div className="h-3 w-12 animate-pulse rounded bg-white/[0.07]" />
                    <div className="h-3 w-10 animate-pulse rounded bg-white/[0.07]" />
                  </div>

                  <div className="h-3 w-24 animate-pulse rounded bg-purple-400/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <span className="sr-only">Loading content, please wait...</span>
    </section>
  );
}

export default Loading;
