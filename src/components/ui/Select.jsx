import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { classNames } from '../../utils/helpers'

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            'w-full appearance-none bg-surface-800/50 border border-surface-600/50 rounded-xl px-4 py-2.5 text-sm text-surface-100',
            'placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50',
            'transition-all duration-200',
            error && 'border-red-500/50 focus:ring-red-500/40',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  )
})

export default Select
