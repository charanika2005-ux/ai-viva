import Card from './Card'

export default function ChartCard({ title, children, className }) {
  return (
    <Card className={className}>
      {title && (
        <h3 className="text-sm font-semibold text-surface-200 mb-4">{title}</h3>
      )}
      <div className="w-full h-64">
        {children}
      </div>
    </Card>
  )
}
