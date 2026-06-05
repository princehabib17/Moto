export function Footer() {
  return (
    <footer className="py-10 px-5 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto border-t border-white/10 mt-20">
      <p className="text-body text-gray-500 uppercase tracking-widest font-semibold">© 2026 Revenant Customs. All rights reserved.</p>
      <div className="flex items-center gap-6">
        <a href="#" className="text-body font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Privacy</a>
        <a href="#" className="text-body font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Terms</a>
        <a href="#" className="text-body font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Contact</a>
      </div>
    </footer>
  );
}
