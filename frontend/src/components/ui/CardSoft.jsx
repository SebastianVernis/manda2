import React from 'react'

const CardSoft = ({ className = '', children }) => (
  <div className={`rounded-2xl bg-white/5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}>
    {children}
  </div>
)

export default CardSoft

