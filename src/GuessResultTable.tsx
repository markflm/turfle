import GuessResultTableRow, { GuessRow } from './GuessResultTableRow'
import { PlayerOption } from './types/PlayerOption'

export type GuessResultTableProps = {
    guesses: GuessRow[]
}

export default function GuessResultTable(props: GuessResultTableProps) {
    const { guesses } = props

    const guessesTemp: GuessRow[] = [
        {
            guessedPlayer: {
                logoUrl:
                    'https://www.si.com/.image/c_fit%2Ccs_srgb%2Cq_auto:good%2Cw_72/MTcwNzkzMDQ4MDY1Nzc4OTUw/cincinnati-bengals-logo.webp',
                playerId: 1,
                name: 'Joe Burrow',
                position: 'QB',
            } as PlayerOption,
            guessAnswers: [
                {
                    category: 'team',
                    status: 'correct',
                    value: 'Cincinatti Bengals',
                },
                { category: 'age', status: 'under', value: '24' },
                { category: 'position', status: 'close', value: 'WR' },
            ],
        },
    ]

    return (
        <div className="border my-4 tracking-wide rounded-sm bg-slate-800 game-table flex flex-col">
            <div className="flex text-white text-left border-b">
                <div className="w-1/3 border-r pl-1">{'Guess'}</div>
                <div className="w-1/3 border-r pl-1">Team</div>
                <div className="w-1/6 border-r pl-1">Age</div>
                <div className="w-1/6 border-r pl-1">Position</div>
            </div>
            {guessesTemp.map((guess) => (
                <GuessResultTableRow row={guess}></GuessResultTableRow>
            ))}
        </div>
    )
}
