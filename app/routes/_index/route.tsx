import { useState } from 'react'
import clsx from 'clsx'
import type { MetaArgs } from 'react-router'
import Header from '~/components/Header'
import BaseInformationForm from './BaseInformationForm'
import ConcertSelectForm from './ConcertSelectForm'
import Submit from './Submit'

export function meta(_: MetaArgs) {
  return [{ title: 'Replay 5525' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'base' | 'concert'>('base')
  return (
    <div
      className={clsx(['mx-auto max-w-screen-md flex flex-col h-dvh overflow-hidden', 'md:border-l-2 md:border-r-2'])}
    >
      <Header />
      {currentStep === 'base' && <BaseInformationForm />}
      {currentStep === 'concert' && <ConcertSelectForm />}
      <Submit currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  )
}