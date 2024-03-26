import { Fade, Modal } from '@mui/material'

export type InfoPopupProps = {
    isOpen: boolean
    onClose: () => void
}

export default function InfoPopup(props: InfoPopupProps) {
    const { isOpen, onClose } = props

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Fade in={isOpen}>
                <div className="center-modal rubik-font-howto outline-none overflow-x-hidden mobile:max-w-[90%] tablet:min-w-[500px] max-h-[85%]">
                    <div
                        onClick={onClose}
                        className="text-2xl cursor-pointer absolute right-4 top-2"
                    >
                        X
                    </div>
                    <div className="flex flex-col bg-white items-center px-10 py-7 rounded-md gap-3 text-lg text-left mobile:overflow-y-scroll overflow-x-hidden">
                        <div className="text-4xl mx-auto">INFORMATION</div>
                        <div className="text-2xl mx-auto">Data Sources</div>
                        <div className="mr-auto">
                            Player data is provided by the{' '}
                            <a
                                className="underline"
                                href="https://docs.sleeper.com"
                                target="_blank"
                            >
                                Sleeper API
                            </a>{' '}
                            and updated manually. The last update date appears
                            below the player search box. <br />
                            Player teams & team guess feedback may be wrong if
                            team changes have occurred since the update date.
                        </div>
                        <div className="text-2xl mx-auto">Player List</div>
                        <div className="mr-auto">
                            To make the game accessible to more than the most
                            dedicated fantasy football players, an attempt has
                            been made to only include 'relevant' players as
                            options to guess. Only active players with a Sleeper
                            search_rank over a certain threshold are included.
                            <br />
                            Backups (QB2s, RB3s, etc.) may be included if their
                            search_rank was high enough to make the cut at time
                            of last update.
                        </div>
                        <div className="text-2xl mx-auto">POTD Selection</div>
                        <div className="mr-auto">
                            POTD is randomly selected from the above list of
                            players, with stricter 'relevance' criteria applied.
                            In usual operation a POTD will not repeat, but the
                            list of past-POTDs is reset when data is updated
                            from Sleeper.
                            <br />
                            Protip for reading this far: at time of writing,
                            there's an 87.5% chance the POTD is an offensive
                            player!
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
