import { Box } from '@mui/material'
import { Answer, Categories, CategoryStatus } from './types/Answer'
import { PlayerOption } from './types/PlayerOption'
import { useMemo, useState } from 'react'

export type GuessResultTableRowProps = {
    row: GuessRow
}

export type GuessRow = {
    guessedPlayer: PlayerOption
    guessAnswers: Answer[]
}

export default function GuessResultTableRow(props: GuessResultTableRowProps) {
    const [rowStatuses, setRowStatuses] = useState<
        { cat: Categories; color: string }[]
    >([])
    const { row } = props

    useMemo(() => {
        const rowStats: { cat: Categories; color: string }[] = []
        row.guessAnswers.map((ga) => {
            let color = ''
            switch (ga.status) {
                case 'correct':
                    color = 'bg-green-600'
                    break
                case 'over':
                case 'under':
                case 'close':
                    color = 'bg-amber-400'
                    break
                case 'very close':
                    color = 'bg-lime-500'
                    break
                case 'miss':
                    color = 'bg-red-600'
                    break
            }
            rowStats.push({ cat: ga.category, color })
        })
        setRowStatuses(rowStats)
    }, [row])

    const teamAnswer = row.guessAnswers.find((x) => x.category == 'team')
    const ageAnswer = row.guessAnswers.find((x) => x.category == 'age')
    const positionAnswer = row.guessAnswers.find(
        (x) => x.category == 'position'
    )

    return (
        <div className="flex text-white border-b">
            <div className="w-1/3 border-r p-2">
                <Box
                    sx={{
                        '& > img': { mr: 2, flexShrink: 0 },
                        display: 'flex',
                    }}
                    {...props}
                >
                    <img
                        loading="eager"
                        width="32"
                        src={row.guessedPlayer.logoUrl}
                    />
                    | {row.guessedPlayer.name} | {row.guessedPlayer.position}
                </Box>
            </div>
            <div
                className={`w-1/3 border-r  flex p-2  ${
                    rowStatuses.find((x) => x.cat == 'team')?.color
                } `}
            >
                <div className="mx-auto">{teamAnswer?.value}</div>
            </div>
            <div
                className={`w-1/6 border-r  flex p-2  ${
                    rowStatuses.find((x) => x.cat == 'age')?.color
                } `}
            >
                <div className="mx-auto flex gap-1">
                    {ageAnswer?.value}
                    {ageAnswer?.status === 'correct' ? (
                        <></>
                    ) : ageAnswer?.status === 'over' ? (
                        <div>V</div>
                    ) : (
                        <div>^</div>
                    )}
                </div>
            </div>
            <div
                className={`w-1/6 border-r flex p-2 ${
                    rowStatuses.find((x) => x.cat == 'position')?.color
                } `}
            >
                <div className="mx-auto">{positionAnswer?.value}</div>
            </div>
        </div>
    )
}
