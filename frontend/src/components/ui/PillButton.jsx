import React from 'react'

const PillButton = ({ active = false, children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-5 py-2 rounded-full border text-sm transition-all ${
      active
        ? 'bg-white text-black border-white'
        : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'
    } ${className}`}
  >
    {children}
  </button>
)

export default PillButton

