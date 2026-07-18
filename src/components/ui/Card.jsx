import { classNames } from '../../utils/helpers'
import { motion } from 'framer-motion'

export default function Card({ children, className, hover = false, glow = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classNames(
        'glass-card rounded-2xl p-6',
        hover && 'glass-hover transition-all duration-300',
        glow && 'glow-purple',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
