import Logo from "@/components/layout/Logo";

export default function PaymentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-6 sm:px-10">
        <Logo light={false} />
      </header>
      <main className="flex justify-center px-4 pb-16 pt-6 sm:pt-12">
        {children}
      </main>
    </div>
  );
}
