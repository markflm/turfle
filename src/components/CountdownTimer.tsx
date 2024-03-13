import { useEffect, useRef, useState } from 'react'

export type CountdownTimerProps = {
    unixTimeEnds: number
}

export type CountdownTimer = {
    hours: number
    minutes: number
    seconds: number
}

const finishedTimer = {
    hours: 0,
    minutes: 0,
    seconds: 0,
}

const hourInSeconds = 3600
export default function CountdownTimer(props: CountdownTimerProps) {
    const { unixTimeEnds } = props
    const firstUpdate = useRef(true)
    const [remainingTime, setRemainingTime] =
        useState<CountdownTimer>(finishedTimer)

    useEffect(() => {
        const timeTil = unixTimeEnds - Date.now() / 1000

        const hours = Math.floor(timeTil / hourInSeconds)
        const minutes = Math.floor((timeTil % hourInSeconds) / 60)
        const seconds = Math.floor(
            timeTil - (hours * hourInSeconds + minutes * 60)
        )

        const newTimeObj: CountdownTimer = {
            hours,
            minutes,
            seconds,
        }
        if (firstUpdate.current) {
            setRemainingTime(newTimeObj)
            firstUpdate.current = false
        }
        const timer = setInterval(() => {
            setRemainingTime(newTimeObj)
        }, 1000)

        if (timeTil <= 0) {
            setRemainingTime(finishedTimer)
            clearInterval(timer)
        }

        return () => {
            clearInterval(timer)
        }
    })

    return (
        <div className="flex flex-col">
            <div className="flex text-5xl bebas-neue-regular mx-auto gap-2">
                <div>{remainingTime.hours.toString().padStart(2, '0')}:</div>
                <div>{remainingTime.minutes.toString().padStart(2, '0')}:</div>
                <div>{remainingTime.seconds.toString().padStart(2, '0')}</div>
            </div>
            {remainingTime.hours +
                remainingTime.minutes +
                remainingTime.seconds <=
                0 && (
                <div className="text-xl mt-2">
                    Refresh to play today's game!
                </div>
            )}
        </div>
    )
}
