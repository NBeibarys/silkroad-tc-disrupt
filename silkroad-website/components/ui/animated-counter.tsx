'use client'

import CountUp from 'react-countup'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2.5,
  className,
}: AnimatedCounterProps) {
  return (
    <CountUp
      end={value}
      suffix={suffix}
      prefix={prefix}
      duration={duration}
      enableScrollSpy
      scrollSpyOnce
      className={className}
    />
  )
}
