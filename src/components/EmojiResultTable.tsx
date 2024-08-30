import { useContext } from 'react'
import { GuessContext } from '../contexts/GuessContext'
import { CategoryStatus } from '../types/Answer'
import { GuessRow } from '../GuessResultTableRow'

function getEmojiForCategoryStatus(status: CategoryStatus) {
    // 🟩🟥🟨🟧

    switch (status) {
        case 'correct':
            return '🟩'
        case 'miss':
            return '🟥'
        case 'very close':
            return '🟨'
        case 'over':
        case 'under':
        case 'close':
            return '🟧'
    }
}

export function createEmojiTable(guessResults: GuessRow[], isWin: boolean) {
    const tableorder = ['team', 'age', 'position']
    let displayedResults = guessResults

    if (!isWin) displayedResults = guessResults.slice(0, -1)

    let emojiString = ''
    for (const guess of displayedResults) {
        guess.guessAnswers.sort(
            (a, b) =>
                tableorder.indexOf(a.category) - tableorder.indexOf(b.category)
        )
        for (const answer of guess.guessAnswers) {
            emojiString += `${getEmojiForCategoryStatus(answer.status)}`
        }
        emojiString += '\n'
    }

    return emojiString
}

export default function EmojiResultTable(props: { correct: boolean }) {
    const { correct } = props
    const guessResults = useContext(GuessContext)
    return (
        <div className="flex">
            <pre>{createEmojiTable(guessResults, correct)}</pre>
        </div>
    )
}
