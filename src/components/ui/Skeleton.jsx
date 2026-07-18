import { classNames } from '../../utils/helpers'

export default function Skeleton({ className, count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={classNames(
            'animate-shimmer rounded-xl',
            className || 'h-4 w-full'
          )}
        />
      ))}
    </div>
  )
}
