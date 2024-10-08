import { Button, Fade, Modal } from '@mui/material'
import EmojiResultTable, {
    createEmojiTable,
} from './components/EmojiResultTable'
import CountdownTimer from './components/CountdownTimer'
import {
    getDateInEastern,
    getTimeTilMidnightEastern,
} from './utils/dateTimeProvider'
import { useContext } from 'react'
import { GuessContext } from './contexts/GuessContext'

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

    const guessResults = useContext(GuessContext)

    //could usememo or context this but whatever
    const isiOSMobile = navigator.userAgent.includes('iPhone')

    function copyResultsToClipboard() {
        navigator.clipboard.writeText(
            `Turfle ${getDateInEastern(0, 'MM/DD/YY')}\n${createEmojiTable(
                guessResults,
                correct
            )}`
        )
    }
    async function copyResultsToClipboardiOS() {
        const shareData: ShareData = {
            title: `Turfle ${getDateInEastern(0, 'MM/DD/YY')}`,
            text: `Turfle ${getDateInEastern(
                0,
                'MM/DD/YY'
            )}\n${createEmojiTable(guessResults, correct)}`,
            // url: window.location.href,
        }
        if (navigator.canShare(shareData)) {
            await navigator
                .share(shareData)
                .catch((error) => console.error('Error sharing', error))
        } else {
            alert("Native sharing isn't supported in your browser")
        }
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Fade in={isOpen}>
                <div className="center-modal mobile:w-full outline-none flex ">
                    <div className="mx-auto flex flex-col min-h-96 bg-white items-center p-7 text-xl rounded-md gap-7 tablet:min-w-[22rem] mobile:w-10/12">
                        <div className="text-2xl italic">
                            {gameOverAdlibs[0]}
                        </div>
                        {correct ? (
                            <div className="text-xl mx-auto text-center">
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
                        <div className="flex flex-col text-2xl gap-2">
                            <div className="mx-auto">
                                <span className="bebas-neue-regular text-3xl mr-1">
                                    Turfle
                                </span>
                                will reset in:
                            </div>
                            <CountdownTimer
                                unixTimeEnds={getTimeTilMidnightEastern()}
                            ></CountdownTimer>
                        </div>
                        <div className="flex gap-4 justify-between mt-auto mb-2">
                            <div className="my-auto text-xl">
                                Share Results:
                            </div>
                            <EmojiResultTable
                                correct={correct}
                            ></EmojiResultTable>
                        </div>
                        {isiOSMobile ? (
                            <Button
                                variant="outlined"
                                onClick={copyResultsToClipboardiOS}
                            >
                                Share Results
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={copyResultsToClipboard}
                            >
                                Copy to clipboard
                            </Button>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
