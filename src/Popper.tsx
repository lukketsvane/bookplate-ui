"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useFloating, autoUpdate, offset, flip, shift, arrow, Placement } from '@floating-ui/react-dom'

interface PopperProps {
  children: React.ReactNode
  content: React.ReactNode
  placement?: Placement
}

export function Popper({ children, content, placement = 'top' }: PopperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<HTMLDivElement>(null)

  const {
    x,
    y,
    strategy,
    refs,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement,
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refs.floating.current && !refs.floating.current.contains(event.target as Node) &&
          refs.reference.current && !refs.reference.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [refs.floating, refs.reference])

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left']

  return (
    <>
      <div ref={refs.setReference} onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
        >
          {content}
          <div
            ref={arrowRef}
            style={{
              position: 'absolute',
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              [staticSide]: '-4px',
              width: '8px',
              height: '8px',
              transform: 'rotate(45deg)',
              background: 'inherit',
            }}
          />
        </div>
      )}
    </>
  )
}