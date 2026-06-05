import { Loader } from '../icons/Icons'

const variants = {
  primary: 'bg-bronze text-navy-800 hover:bg-bronze-light font-semibold',
  outline: 'border border-bronze text-bronze hover:bg-bronze/10 font-medium',
  ghost: 'text-gray-400 hover:text-white hover:bg-white/5 font-medium',
  danger: 'border border-red-500/50 text-red-400 hover:bg-red-500/10 font-medium',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
