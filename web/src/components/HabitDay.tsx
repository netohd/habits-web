import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { HabitsList } from './HabitsList';
import { ProgressBar } from './ProgressBar'

interface HabitDayProps {
  date: Date
  amount?: number
  defaultCompleted?: number
}

/** Modal que aparece quando se clica em algum dos quadros do sumário (dias)
 * Utilização do radix (lib) para estilização e recurso de acessibilidade
 */
export function HabitDay({ defaultCompleted = 0, amount = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted)

  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0

  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = dayjs(date).format('dddd')

  function handleCompletedChanged(completed: number) {
    setCompleted(completed)
  }

  return (
    <Popover.Root>
      {
        /** clsx é utilizado para passar atributos css e criar condicionais
         * para cor de acordo com porcentagem
         * ==> npm install clsx
         */
      }
      <Popover.Trigger
        className={clsx('bg-zinc-900 w-10 h-10 border-2 border-zinc-800 rounded-lg', {
          'bg-zinc-900 border-zinc-800': completedPercentage === 0,
          'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
          'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
          'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
          'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
          'bg-violet-500 border-violet-400': completedPercentage >= 80,
        })}
      />
      {
        /** Recurso de popup utilizado através da lib radix 
         * => npm install @radix-ui/react-popover
         */
      }
      <Popover.Portal>
        <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>

          <span className='font-semibold text-zinc-400'>{dayOfWeek}</span>
          <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>

          <ProgressBar progress={completedPercentage} />

          <HabitsList date={date} onCompletedChanged={handleCompletedChanged} />

          <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
        </Popover.Content>
      </Popover.Portal>

    </Popover.Root>

  )
}