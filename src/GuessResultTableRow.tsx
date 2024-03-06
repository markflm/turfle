import { Box, Tooltip } from '@mui/material'
import { Answer, Categories, PositionAnswer, TeamAnswer } from './types/Answer'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useMemo, useState } from 'react'
import { standardDelayMs } from './utils/global'
import TeamSameConferenceTooltip from './tooltips/TeamSameConference'
import AgeTooltip from './tooltips/Age'
import PositionTooltip from './tooltips/Position'

export type GuessRow = {
    guessedPlayer: PlayerOption
    guessAnswers: Answer[]
}

export type GuessResultTableRowProps = {
    row: GuessRow
    isLastRow: boolean
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
                    color = 'guessrow-bg-incorrect'
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
    if (!teamAnswer || !ageAnswer || !positionAnswer) {
        console.error(
            "One of the guess answer types wasn't present in guessAnswers array"
        )
        return <></>
    }
    return (
        <div
            className={`flex text-white border-slate-900 ${
                !isLastRow ? 'border-b-2' : ''
            }`}
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
            <Tooltip
                title={
                    <TeamSameConferenceTooltip
                        conferenceName={
                            (teamAnswer.value as TeamAnswer).conference
                        }
                        divisionName={(teamAnswer.value as TeamAnswer).division}
                        status={teamAnswer.status}
                    ></TeamSameConferenceTooltip>
                }
            >
                <div
                    id={`guessteam_${row.guessedPlayer.playerId}`}
                    className={`w-4/12 border-r-2 border-slate-900 flex p-2 invisible rounded-md cursor-pointer ${
                        rowStatuses.find((x) => x.cat == 'team')?.color
                    } `}
                >
                    <div className="m-auto">
                        {(teamAnswer.value as TeamAnswer).teamName}
                    </div>
                </div>
            </Tooltip>
            <Tooltip
                title={<AgeTooltip status={ageAnswer.status}></AgeTooltip>}
            >
                <div
                    id={`guessage_${row.guessedPlayer.playerId}`}
                    className={`w-2/12 border-r-2 border-slate-900  flex p-2 invisible rounded-md cursor-pointer  ${
                        rowStatuses.find((x) => x.cat == 'age')?.color
                    } `}
                >
                    <div className="m-auto flex">
                        <div>{ageAnswer.value as string}</div>
                        {ageAnswer?.status === 'correct' ? (
                            <></>
                        ) : ageAnswer?.status === 'over' ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-4 h-4 mb-auto"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                                />
                            </svg>
                        ) : (
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={3}
                                    stroke="currentColor"
                                    className="w-4 h-4 mb-auto"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </Tooltip>
            <Tooltip
                title={
                    <PositionTooltip
                        status={positionAnswer.status}
                        side={(positionAnswer.value as PositionAnswer).side}
                    ></PositionTooltip>
                }
            >
                <div
                    id={`guessposition_${row.guessedPlayer.playerId}`}
                    className={`w-2/12 border-r-2 border-slate-900 rounded-md flex p-2 invisible cursor-pointer ${
                        rowStatuses.find((x) => x.cat == 'position')?.color
                    } `}
                >
                    <div className="m-auto">
                        {(positionAnswer.value as PositionAnswer).position}
                    </div>
                </div>
            </Tooltip>
        </div>
    )
}
