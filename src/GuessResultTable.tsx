import GuessResultTableRow, { GuessRow } from './GuessResultTableRow'
export type GuessResultTableProps = {
    guesses: GuessRow[]
}

export default function GuessResultTable(props: GuessResultTableProps) {
    const { guesses } = props

    return (
        <div className="border my-4 tracking-wide rounded-sm bg-slate-900 game-table flex flex-col">
            <div className="flex text-white text-left border-b">
                <div className="w-1/3 border-r p-2 flex">
                    <div className="mx-auto text-xl">Player</div>
                </div>
                <div className="w-1/3 border-r p-2 flex">
                    <div className="mx-auto text-xl">Team</div>
                </div>
                <div className="w-1/6 border-r p-2 flex">
                    <div className="mx-auto text-xl">Age</div>
                </div>
                <div className="w-1/6 p-2 flex">
                    <div className="mx-auto text-xl">Position</div>
                </div>
            </div>
            {guesses.map((guess) => (
                <GuessResultTableRow
                    key={guess.guessedPlayer.playerId}
                    row={guess}
                ></GuessResultTableRow>
            ))}
        </div>
    )
}
