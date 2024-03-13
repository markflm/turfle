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

export function createEmojiTable(guessResults: GuessRow[]) {
    let emojiString = ''
    for (const guess of guessResults) {
        for (const answer of guess.guessAnswers) {
            emojiString += `${getEmojiForCategoryStatus(answer.status)}`
        }
        emojiString += '\n'
    }

    return emojiString
}

export default function EmojiResultTable() {
    const guessResults = useContext(GuessContext)
    return (
        <div className="flex">
            <pre>{createEmojiTable(guessResults)}</pre>
        </div>
    )
}
