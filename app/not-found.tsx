import Link from "next/link";
import Logo from "@/components/layout/Logo";

function PizzaOrb() {
  const dot = "absolute rounded-full bg-brand";

  return (
    <span
      aria-hidden="true"
      className="relative block size-28 shrink-0 rounded-full bg-[#f3d9a0] sm:size-44"
    >
      <span className={`${dot} left-[24%] top-[22%] size-[18%]`} />
      <span className={`${dot} right-[22%] top-[16%] size-[20%]`} />
      <span className={`${dot} left-[40%] top-[46%] size-[16%]`} />
      <span className={`${dot} bottom-[18%] left-[18%] size-[20%]`} />
      <span className={`${dot} bottom-[20%] right-[18%] size-[18%]`} />
    </span>
  );
}

export default function NotFound() {
  const four =
    "font-heading text-[7rem] font-bold leading-none text-brand sm:text-[11rem]";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-6 py-6 sm:px-10">
        <Logo light={false} />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 text-center">
        <div className="flex items-center gap-1 sm:gap-3" aria-hidden="true">
          <span className={four}>4</span>
          <PizzaOrb />
          <span className={four}>4</span>
        </div>

        <h1 className="mt-8 font-heading text-4xl font-bold sm:text-5xl">
          This slice is missing
        </h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          The page you are looking for does not exist or has moved. Let us get
          you back to something delicious.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
          >
            Back to Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex h-12 items-center rounded-full border border-border bg-card px-8 text-sm font-medium transition-colors hover:bg-muted"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    </div>
  );
}
