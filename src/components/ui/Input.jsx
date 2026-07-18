import { forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { classNames } from '../../utils/helpers'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, type = 'text', className, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={classNames(
            'w-full bg-surface-800/50 border border-surface-600/50 rounded-xl px-4 py-2.5 text-sm text-surface-100',
            'placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50',
            'transition-all duration-200',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-500/50 focus:ring-red-500/40',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  )
})

export default Input
