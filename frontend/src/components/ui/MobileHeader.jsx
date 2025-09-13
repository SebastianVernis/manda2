import React from 'react'

const IconButton = ({ children, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 shadow-sm backdrop-blur ${className}`}
  >
    {children}
  </button>
)

const MobileHeader = ({ title, left, right, children }) => {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {left || <span className="w-9" />}
          {title && <h2 className="text-base font-semibold text-white/90">{title}</h2>}
        </div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
      {children ? (
        <div className="mt-2 text-center">{children}</div>
      ) : null}
    </div>
  )
}

MobileHeader.IconButton = IconButton
export default MobileHeader
