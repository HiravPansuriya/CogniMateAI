export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary mesh-gradient relative">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 w-full max-w-md mx-4">{children}</div>
    </div>
  );
}
