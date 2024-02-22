import { Box, Tooltip } from '@mui/material'
import { Answer, Categories } from './types/Answer'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useMemo, useState } from 'react'
import { standardDelayMs } from './utils/global'
import TeamSameConference from './tooltips/TeamSameConference'

export type GuessResultTableRowProps = {
    row: GuessRow
    isLastRow: boolean
}

export type GuessRow = {
    guessedPlayer: PlayerOption
    guessAnswers: Answer[]
}

export default function GuessResultTableRow(props: GuessResultTableRowProps) {
    const [rowStatuses, setRowStatuses] = useState<
        { cat: Categories; color: string }[]
    >([])
    const { row, isLastRow } = props

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
                    color = 'bg-yellow-500'
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

    useEffect(() => {
        const idprefixes = [
            'guessname_',
            'guessteam_',
            'guessage_',
            'guessposition_',
        ]
        for (let i = 0; i <= 3; i++) {
            setTimeout(
                () => {
                    const element = document.getElementById(
                        `${idprefixes[i]}${row.guessedPlayer.playerId}`
                    )

                    element?.classList.add('roll-out')
                    setTimeout(() => {
                        element?.classList.remove('invisible')
                    }, 400)
                },
                i == 0 ? 0 : standardDelayMs * i
            )
        }
    }, [])

    const teamAnswer = row.guessAnswers.find((x) => x.category == 'team')
    const ageAnswer = row.guessAnswers.find((x) => x.category == 'age')
    const positionAnswer = row.guessAnswers.find(
        (x) => x.category == 'position'
    )

    return (
        <div
            className={`flex text-white ${
                !isLastRow ? 'border-b-2' : ''
            } border-slate-900`}
        >
            <div
                id={`guessname_${row.guessedPlayer.playerId}`}
                className="w-4/12 border-r-2  border-slate-900 p-2 invisible"
            >
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
                        src={`${window.location.href}/logos/${row.guessedPlayer.logoUrl}`}
                    />
                    <div className="my-auto">
                        | {row.guessedPlayer.name} |{' '}
                        {row.guessedPlayer.position}{' '}
                    </div>
                </Box>
            </div>
            <Tooltip title={<TeamSameConference></TeamSameConference>}>
                <div
                    id={`guessteam_${row.guessedPlayer.playerId}`}
                    className={`w-4/12 border-r-2 border-slate-900 flex p-2 invisible rounded-md ${
                        rowStatuses.find((x) => x.cat == 'team')?.color
                    } `}
                >
                    <div className="m-auto">{teamAnswer?.value}</div>
                </div>
            </Tooltip>
            <div
                id={`guessage_${row.guessedPlayer.playerId}`}
                className={`w-2/12 border-r-2 border-slate-900  flex p-2 invisible rounded-md  ${
                    rowStatuses.find((x) => x.cat == 'age')?.color
                } `}
            >
                <div className="m-auto flex gap-1">
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
                id={`guessposition_${row.guessedPlayer.playerId}`}
                className={`w-2/12 border-r-2 border-slate-900 rounded-md flex p-2 invisible ${
                    rowStatuses.find((x) => x.cat == 'position')?.color
                } `}
            >
                <div className="m-auto">{positionAnswer?.value}</div>
            </div>
        </div>
    )
}
