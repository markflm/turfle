import GuessResultTableRow, { GuessRow } from './GuessResultTableRow'
import { useCustomMediaQuery } from './hooks/useMediaQuery'
export type GuessResultTableProps = {
    guesses: GuessRow[]
}

export default function GuessResultTable(props: GuessResultTableProps) {
    const { guesses } = props
    //todo - replace hardcoded 'ismobile' pixel def
    const isMobile = useCustomMediaQuery('only screen and (max-width : 899px)')
    return isMobile ? (
        <div className="my-4 tracking-wide rounded-md bg-slate-800 flex flex-col mx-auto w-11/12">
            {guesses.map((guess, index) => (
                <GuessResultTableRow
                    key={guess.guessedPlayer.playerId}
                    row={guess}
                    isLastRow={index == guesses.length - 1}
                ></GuessResultTableRow>
            ))}
        </div>
    ) : (
        <div className="my-4 tracking-wide rounded-md bg-slate-800 game-table flex flex-col">
            <div className="flex text-white text-left border-b mb-1">
                <div className="w-5/12 border-r p-2 flex">
                    <div className="mx-auto text-xl">Player</div>
                </div>
                <div className="w-4/12 border-r p-2 flex">
                    <div className="mx-auto text-xl">Team</div>
                </div>
                <div className="w-1/12 border-r p-2 flex">
                    <div className="mx-auto text-xl">Age</div>
                </div>
                <div className="w-2/12 p-2 flex">
                    <div className="mx-auto text-xl">Position</div>
                </div>
            </div>
            {guesses.map((guess, index) => (
                <GuessResultTableRow
                    key={guess.guessedPlayer.playerId}
                    row={guess}
                    isLastRow={index == guesses.length - 1}
                ></GuessResultTableRow>
            ))}
        </div>
    )
}
