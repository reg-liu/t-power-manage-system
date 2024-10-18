import React from 'react'
import { Card as AntCard } from 'antd'
import classNames from 'classnames'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <AntCard
      className={classNames(
        'w-full max-w-md p-8 shadow-lg rounded-lg',
        className
      )}
    >
      {children}
    </AntCard>
  )
}