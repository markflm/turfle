import { Box, Tooltip } from '@mui/material'
import { Answer, Categories, PositionAnswer, TeamAnswer } from './types/Answer'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useMemo, useState } from 'react'
import { standardDelayMs } from './utils/global'
import TeamSameConferenceTooltip from './tooltips/TeamSameConference'
import AgeTooltip from './tooltips/Age'
import PositionTooltip from './tooltips/Position'
import { useCustomMediaQuery } from './hooks/useMediaQuery'

export type GuessRow = {
    guessedPlayer: PlayerOption
    guessAnswers: Answer[]
}

export type GuessResultTableRowProps = {
    row?: GuessRow
    isLastRow: boolean
}

export default function GuessResultTableRow(props: GuessResultTableRowProps) {
    const [rowStatuses, setRowStatuses] = useState<
        { cat: Categories; color: string }[]
    >([])
    const { row, isLastRow } = props

    const isMobile = useCustomMediaQuery('only screen and (max-width : 899px)')
    const teamAnswer = row?.guessAnswers.find((x) => x.category == 'team')
    const ageAnswer = row?.guessAnswers.find((x) => x.category == 'age')
    const positionAnswer = row?.guessAnswers.find(
        (x) => x.category == 'position'
    )
    if ((!teamAnswer || !ageAnswer || !positionAnswer) && row) {
        console.error(
            "One of the guess answer types wasn't present in guessAnswers array"
        )
        return <></>
    }
    const playerDiv = (row?: GuessRow) => {
        if (!row) {
            return (
                <div
                    id={`guessname_finalrow`}
                    className="border-slate-900 py-2 mobile:border-b-2 mobile:mx-auto mobile:w-full  mobile:h-16 mobile:flex tablet:w-5/12 tablet:border-r-2 tablet:px-2 opacity-10 bg-gray-300 "
                ></div>
            )
        }
        return (
            <div
                id={`guessname_${row.guessedPlayer.playerId}`}
                className={`border-slate-900 py-2  mobile:mx-auto mobile:w-full  mobile:h-16 mobile:flex tablet:w-5/12 tablet:border-r-2 tablet:px-2 ${
                    isLastRow ? 'opacity-10 bg-gray-300' : 'invisible'
                } `}
            >
                <Box
                    id={`guessname_${row.guessedPlayer.playerId}_content`}
                    sx={{
                        '& > img': { mr: 2, flexShrink: 0 },
                        display: 'flex',
                    }}
                    className="invisible mobile:mx-auto"
                >
                    <img
                        loading="eager"
                        width={isMobile ? 50 : 32}
                        src={`${window.location.href}/logos/${row.guessedPlayer.logoUrl}`}
                    />
                    <div className="my-auto text-lg ">
                        | {row.guessedPlayer.name} |{' '}
                        {row.guessedPlayer.position}
                    </div>
                </Box>
            </div>
        )
    }

    const teamDiv = (row?: GuessRow) => {
        if (!row) {
            return (
                <div
                    id={`guessteam_finalrow`}
                    className={`border-r-2 border-slate-900 flex p-2 rounded-md  tablet:w-4/12 mobile:w-7/12 opacity-10 bg-gray-300 `}
                ></div>
            )
        }
        if (!teamAnswer) return <></>
        return (
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
                    className={`border-r-2 border-slate-900  flex p-2 rounded-md cursor-pointer tablet:w-4/12 mobile:w-7/12   ${
                        rowStatuses.find((x) => x.cat == 'team')?.color
                    } ${isLastRow ? 'opacity-10 bg-gray-300' : 'invisible'}`}
                >
                    <div
                        className={`m-auto ${isLastRow ? 'invisible' : ''}`}
                        id={`guessteam_${row.guessedPlayer.playerId}_content`}
                    >
                        {(teamAnswer.value as TeamAnswer).teamName}
                    </div>
                </div>
            </Tooltip>
        )
    }
    const ageDiv = (row?: GuessRow) => {
        if (!row) {
            return (
                <div
                    id={`guessage_finalrow`}
                    className={`border-r-2 border-slate-900  flex p-2 rounded-md  mobile:w-3/12 tablet:w-1/12 opacity-10 bg-gray-300 `}
                ></div>
            )
        }
        if (!ageAnswer) return <></>
        return (
            <Tooltip
                title={<AgeTooltip status={ageAnswer.status}></AgeTooltip>}
            >
                <div
                    id={`guessage_${row.guessedPlayer.playerId}`}
                    className={`border-r-2 border-slate-900  flex p-2 rounded-md cursor-pointer mobile:w-3/12 tablet:w-1/12  ${
                        rowStatuses.find((x) => x.cat == 'age')?.color
                    } ${isLastRow ? 'opacity-10 bg-gray-300' : 'invisible'}`}
                >
                    <div
                        className={`m-auto flex ${
                            isLastRow ? 'invisible' : ''
                        }`}
                        id={`guessage_${row.guessedPlayer.playerId}_content`}
                    >
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
        )
    }

    const positionDiv = (row?: GuessRow) => {
        if (!row) {
            return (
                <div
                    id={`guessposition_finalrow`}
                    className={` border-slate-900 rounded-md flex p-2 w-2/12 opacity-10 bg-gray-300 `}
                ></div>
            )
        }
        if (!positionAnswer) return <></>
        return (
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
                    className={`border-r-2 border-slate-900 rounded-md flex p-2 cursor-pointer w-2/12  ${
                        rowStatuses.find((x) => x.cat == 'position')?.color
                    } ${isLastRow ? 'opacity-10 bg-gray-300' : 'invisible'}`}
                >
                    <div
                        className={`m-auto             ${
                            isLastRow ? 'invisible' : ''
                        }`}
                        id={`guessposition_${row.guessedPlayer.playerId}_content`}
                    >
                        {(positionAnswer.value as PositionAnswer).position}
                    </div>
                </div>
            </Tooltip>
        )
    }
    //todo - could definitely refactor this by abstracting table category divs out. a lot of repeating here.
    if (!row)
        return (
            <div
                className={`flex text-white rounded-b-md ${
                    !isLastRow ? 'border-b-2 border-white' : ''
                }`}
            >
                {isMobile ? (
                    <div className="flex flex-col w-full">
                        {playerDiv(row)}
                        <div className="flex min-h-14 w-full ">
                            {teamDiv(row)}
                            {ageDiv(row)}
                            {positionDiv(row)}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-12 w-full">
                        {playerDiv(row)}
                        {teamDiv(row)}
                        {ageDiv(row)}
                        {positionDiv(row)}
                    </div>
                )}
            </div>
        )
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
                    color = 'guessrow-bg-miss'
                    break
                case 'very close':
                    color = 'guessrow-bg-nearmiss'
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
                    const elementContent = document.getElementById(
                        `${idprefixes[i]}${row.guessedPlayer.playerId}_content`
                    )

                    element?.classList.add('roll-out')

                    setTimeout(() => {
                        elementContent?.classList.remove('invisible')
                        element?.classList.remove('invisible')
                        element?.classList.remove('opacity-10', 'bg-gray-300')
                    }, 400)
                },
                i == 0 ? 0 : standardDelayMs * i
            )
        }
    }, [])

    return (
        <div
            className={`flex text-white border-slate-900 ${
                !isLastRow ? 'border-b-2 ' : 'rounded-b-md  '
            }`}
        >
            {isMobile ? (
                <div className="flex flex-col w-full">
                    {playerDiv(row)}
                    <div className="flex min-h-14 w-full ">
                        {teamDiv(row)}
                        {ageDiv(row)}
                        {positionDiv(row)}
                    </div>
                </div>
            ) : (
                <div className="flex w-full">
                    {playerDiv(row)}
                    {teamDiv(row)}
                    {ageDiv(row)}
                    {positionDiv(row)}
                </div>
            )}
        </div>
    )
}
