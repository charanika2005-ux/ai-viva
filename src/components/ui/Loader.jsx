import { classNames } from '../../utils/helpers'

export default function Loader({ fullScreen = false, size = 'md', className }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const spinner = (
    <div className={classNames('relative', sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-surface-700" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm text-surface-400 animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  )
}
