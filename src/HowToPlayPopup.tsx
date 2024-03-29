import { Fade, Modal } from '@mui/material'

export type HowToPlayPopupProps = {
    isOpen: boolean
    onClose: () => void
}

export default function HowToPlayPopup(props: HowToPlayPopupProps) {
    const { isOpen, onClose } = props

    function checkOnClose(reason: string) {
        if (reason == 'backdropClick') return
        onClose()
    }
    //could usememo or context this but whatever
    const isiOSMobile = navigator.userAgent.includes('iPhone')
    return (
        <Modal open={isOpen} onClose={(_event, reason) => checkOnClose(reason)}>
            <Fade in={isOpen}>
                <div className="center-modal rubik-font-howto outline-none overflow-x-hidden mobile:max-w-[90%] tablet:min-w-[500px] mobile:max-h-[85%]  ">
                    <div
                        onClick={onClose}
                        className="text-2xl cursor-pointer absolute right-4 top-2"
                    >
                        X
                    </div>
                    <div className="flex flex-col bg-white items-center px-10 py-7 rounded-md gap-3 text-lg text-left mobile:overflow-y-scroll overflow-x-hidden">
                        <div className="text-2xl mx-auto">How To Play</div>
                        <div className="text-7xl mx-auto bebas-neue-title">
                            TURFLE
                        </div>
                        <div className="mr-auto">
                            Each day you'll have FIVE chances to guess the
                            (mostly) randomly selected NFL Player of the Day
                            (POTD).
                        </div>
                        <div>
                            You'll get feedback on how close your guessed player
                            is to the POTD in each category on a scale of Red
                            (far from POTD) to Green (correct for POTD).
                        </div>
                        <div className="howto-color-card-container text-white ">
                            <div className="guessrow-bg-incorrect">FAR</div>
                            <div className="text-black">{'<'}</div>
                            <div className="guessrow-bg-miss">CLOSE</div>
                            <div className="text-black">{'<'}</div>
                            <div className="guessrow-bg-nearmiss">CLOSER</div>
                            <div className="text-black">{'<'}</div>
                            <div className="guessrow-bg-correct">CORRECT</div>
                        </div>
                        <div>
                            Mousing over (Desktop) or tap & holding (Mobile) on
                            a category for one of your guesses can provide
                            additional information.
                        </div>
                        {!isiOSMobile /* iOS doesn't support webm*/ && (
                            <video autoPlay muted loop>
                                <source
                                    src="/videos/turfle-example.webm"
                                    type="video/webm"
                                />
                            </video>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
