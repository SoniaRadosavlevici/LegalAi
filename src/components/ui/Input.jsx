export default function Input({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium tracking-luxury uppercase text-gray-400">
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white
            placeholder-gray-600 focus:outline-none focus:border-bronze/60
            transition-colors duration-200 resize-none"
          rows={4}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white
            focus:outline-none focus:border-bronze/60 transition-colors duration-200
            cursor-pointer appearance-none"
          {...props}
        />
      ) : (
        <input
          type={type}
          className="bg-navy-700 border border-white/10 rounded px-4 py-3 text-sm text-white
            placeholder-gray-600 focus:outline-none focus:border-bronze/60
            transition-colors duration-200"
          {...props}
        />
      )}
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}
