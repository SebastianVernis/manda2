import React from 'react'

const Backdrop = ({ onClick }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClick} />
)

const BottomSheet = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 rounded-t-3xl bg-[#0b0b0b] border-t border-white/10 p-4 max-h-[80vh] overflow-auto">
        <div className="mx-auto h-1.5 w-20 rounded-full bg-white/20 mb-3" />
        {children}
      </div>
    </>
  )
}

export default BottomSheet

