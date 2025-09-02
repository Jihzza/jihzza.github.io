// src/components/ui/Button.jsx (or your Button file)
export default function Button({
  children,
  className = '',
  isLoading = false,
  noOuterPadding = false,
  ...rest // <-- `isLoading` is removed from rest by destructuring above
}) {
  const btn = (
    <button
      type="button"
      className={`w-auto px-3 py-2 rounded-lg bg-[#BFA200] text-black font-semibold ${className}`}
      disabled={rest.disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      {...rest}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  );
  return noOuterPadding ? btn : <div className="py-4">{btn}</div>;
}
