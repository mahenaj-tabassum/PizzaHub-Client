import Link from "next/link";
import Logo from "@/components/layout/Logo";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  mode: "signin" | "signup";
}

export default function AuthShell({
  title,
  description,
  children,
  mode,
}: AuthShellProps) {
  const isSignup = mode === "signup";
  const bgImage =
    mode === "signin" ? "/images/signin-pizza.jpg" : "/images/signup-pizza.jpg";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left promotional panel */}
      <section
        className="relative hidden min-h-screen flex-col justify-end overflow-hidden bg-cover bg-center px-12 py-14 lg:flex"
        style={{
          backgroundImage: `
  		  linear-gradient(
  		    to top,
  		    rgba(35, 13, 11, 0.96),
  		    rgba(91, 23, 17, 0.72),
  		    rgba(75, 20, 15, 0.48)
  		  ),
  		  url('${bgImage}')
  		`,
        }}
      >
        <div className="relative z-10 max-w-xl">
          <Logo />

          <h1 className="mt-10 font-heading text-5xl font-bold leading-tight text-[#fff4e8] xl:text-6xl">
            {isSignup
              ? "Your next favorite slice is a few taps away."
              : "Hot, fresh pizza is waiting for you."}
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-[#f5dfc9]">
            {isSignup
              ? "Join PizzaHub to discover local pizza shops, or list your own menu."
              : "Sign in to order from local pizza shops or manage your restaurant."}
          </p>
        </div>
      </section>

      {/* Right form panel */}
      <section className="relative flex min-h-screen items-center justify-center bg-[#f8efe4] px-5 py-12 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="absolute right-6 top-7 text-sm font-medium text-[#73554a] transition hover:text-[#981e24] sm:right-10"
        >
          ← Back to home
        </Link>

        <div className="w-full max-w-[490px]">
          <div className="mb-7">
            <div className="mb-5 lg:hidden">
              <Logo light={false} />
            </div>

            <h2 className="font-heading text-4xl font-bold tracking-tight text-[#281916] sm:text-[42px]">
              {title}
            </h2>

            <p className="mt-3 text-[16px] leading-7 text-[#76584d]">
              {description}
            </p>
          </div>

          {children}
        </div>
      </section>
    </div>
  );
}
