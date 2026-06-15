export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary-dark text-primary-foreground shadow-[var(--shadow-card)] ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M4 18c0-3 2-5 4-5 1.5 0 2 1 3 1s1.5-1 3-1c2 0 4 2 4 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="8.5" cy="9" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="9" r="1.5" fill="currentColor" />
        <path
          d="M6 7c-1-2 0-4 2-4M18 7c1-2 0-4-2-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
