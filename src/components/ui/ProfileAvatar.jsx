import { getInitials } from '../../utils/helpers'

export default function ProfileAvatar({ name, src, size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  }

  const initials = getInitials(name || 'U')

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-semibold text-white shrink-0 ${sizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}
