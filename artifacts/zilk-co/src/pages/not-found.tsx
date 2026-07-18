export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-white mb-4">404</h1>
        <p className="text-lg text-white/60 font-mono">Page not found.</p>
        <a href="/" className="mt-8 inline-block px-6 py-3 border border-white/10 hover:border-primary/50 text-sm font-mono uppercase tracking-widest text-white transition-colors">
          Return Home
        </a>
      </div>
    </div>
  );
}
