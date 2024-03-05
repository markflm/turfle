import { Button, Fade, Modal } from '@mui/material'
import EmojiResultTable from './components/EmojiResultTable'

export type EndGamePopupProps = {
    guesses: number
    guessLimit: number
    correct: boolean
    isOpen: boolean
    potdName: string
    onClose: () => void
}

const gameOverAdlibs = ["That's game!", "That'll do it!"]

export default function EndGamePopUp(props: EndGamePopupProps) {
    const { guesses, correct, isOpen, potdName, guessLimit, onClose } = props
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Fade in={isOpen}>
                <div className="center-modal">
                    <div className="flex flex-col h-96 bg-white items-center p-7 rounded-md gap-7">
                        <div className="text-2xl italic">
                            {gameOverAdlibs[0]}
                        </div>
                        {correct ? (
                            <div className="text-xl mx-auto">
                                You correctly guessed <b>{potdName}</b> in{' '}
                                {guesses + guessLimit / 2 < guessLimit
                                    ? 'just '
                                    : ''}
                                {guesses} attempts!
                            </div>
                        ) : (
                            <div>
                                <div>Better luck next time!</div>
                            </div>
                        )}
                        <div className="flex flex-col text-xl">
                            <div>Turfle will reset in:</div>
                        </div>
                        <div className="flex gap-4 justify-between mt-auto mb-2">
                            <div className="my-auto text-lg">
                                Share Results:
                            </div>
                            <EmojiResultTable></EmojiResultTable>
                        </div>
                        <Button variant="outlined">Copy to clipboard</Button>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
