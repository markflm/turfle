import { useMutation, useQuery } from 'react-query'
import { checkGuess, getAllPlayers, getPotd } from './db/supabase-client'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import GuessResultTable from './GuessResultTable'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useRef, useState } from 'react'
import { GuessRow } from './GuessResultTableRow'
import { CategoryStatus } from './types/Answer'
import { additionalGameOverDelayMs, standardDelayMs } from './utils/global'
import EndGamePopUp from './EndGamePopup'
import HowToPlayPopup from './HowToPlayPopup'
import {
    getDateInEastern,
    getPrevDayCutoffUnix,
} from './utils/dateTimeProvider'
import { imageSrcs } from './utils/imageList'
import { GuessContext } from './contexts/GuessContext'
import InfoPopup from './InfoPopup'

const guessLimit = 2

export default function GameTable() {
    const firstUpdate = useRef(true)
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
        null
    )
    const [guessResults, setGuessResults] = useState<GuessRow[]>([])
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false)
    const [guessedCorrectly, setGuessedCorrectly] = useState<boolean>(false)
    const [autocompleteInput, setAutocompleteInput] = useState<string>('')
    const [potdDate, setPotdDate] = useState<string>(getDateInEastern())
    const [potdGuessRow, setPotdGuessRow] = useState<GuessRow>({})

    const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false)
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false)

    const { data: playerValues, isLoading: getAllPlayersLoading } = useQuery(
        ['all_players'],
        async () => {
            return await getAllPlayers()
        },
        { staleTime: Infinity }
    )

    const { data: potd, isLoading: getPotdLoading } = useQuery(
        ['potd'],
        async () => {
            const potdResponse = await getPotd(potdDate)
            if (!potdResponse) {
                console.error('No POTD response in fetch')
                return
            }
            //todo 3/27 - alter potd function to return logoURL too
            // const x = {guessedPlayer: {logoUrl: potd.}} as GuessRow

            return potdResponse
        },
        { staleTime: Infinity }
    )

    useEffect(() => {
        console.log('double load ue fired')
        if (potd && playerValues) {
            setPotdGuessRow({
                // @ts-ignore
                guessedPlayer: {
                    ...potd,
                    logoUrl:
                        playerValues.find((x) => x.playerId === potd.player_id)
                            ?.logoUrl || '',
                },
                guessAnswers: [
                    {
                        category: 'team',
                        status: 'correct',
                        value: {
                            teamName: potd.team_name,
                            division: potd.division,
                            conference: potd.conference,
                        },
                    },
                    {
                        category: 'age',
                        status: 'correct',
                        value: potd.age,
                    },
                    {
                        category: 'position',
                        status: 'correct',
                        value: {
                            position: potd.position_name,
                            side: potd.position_side,
                        },
                    },
                ],
            })
        }
    }, [getPotdLoading, getAllPlayersLoading])
    const submitGuess = useMutation({
        //@ts-expect-error
        mutationFn: ({ playerId, date }) => checkGuess(playerId, date),
    })

    useEffect(() => {
        const lastExistingGuess = localStorage.getItem('turfle-time')
        //if you have guesses but they're older than midnight yesterday (EST), clear your localstorage
        if (lastExistingGuess) {
            const midnightYesterdayUnix = getPrevDayCutoffUnix()

            if (parseInt(lastExistingGuess) < midnightYesterdayUnix) {
                localStorage.removeItem('turfle-guesses')
                localStorage.removeItem('turfle-time')
                return
            }
        }

        const acknowledgedHowToPlay = localStorage.getItem('turfle-how-to-play')

        // if (!acknowledgedHowToPlay) setShowHowToPlayModal(true)
    }, [])

    useEffect(() => {
        if (getPotdLoading) return
        const existingGuesses = localStorage.getItem('turfle-guesses')
        if (existingGuesses) {
            //todo - maybe check that existingGuesses haven't been tampered with
            const parsedGuesses: GuessRow[] = JSON.parse(existingGuesses)
            setGuessResults(JSON.parse(existingGuesses))

            if (
                parsedGuesses[parsedGuesses.length - 1].guessedPlayer
                    .playerId == potd?.player_id
            ) {
                setGuessedCorrectly(true)
                endGameWithAnimationDelay(true)
            } else if (parsedGuesses.length >= guessLimit) {
                setGuessedCorrectly(false)
                endGameWithAnimationDelay(false)
            }
        }
    }, [getPotdLoading])

    useEffect(() => {
        //write to localstorage
        if (guessResults.length) {
            localStorage.setItem('turfle-guesses', JSON.stringify(guessResults))
        }
    }, [guessResults, guessResults.length])

    useEffect(() => {
        if (submitGuess.isSuccess) {
            setAutocompleteInput('')
            const existingGuesses = [...guessResults]
            const guessResult = submitGuess.data
            if (!selectedPlayer || !guessResult) return
            existingGuesses.push({
                guessedPlayer: selectedPlayer,
                guessAnswers: [
                    {
                        category: 'age',
                        status: guessResult[0].age_answer as CategoryStatus,
                        value: guessResult[0].age,
                    },
                    {
                        category: 'position',
                        status: guessResult[0]
                            .position_answer as CategoryStatus,
                        value: {
                            position: guessResult[0].position_name,
                            side: guessResult[0].position_side,
                        },
                    },
                    {
                        category: 'team',
                        status: guessResult[0].team_answer as CategoryStatus,
                        value: {
                            teamName: guessResult[0].team_name,
                            division: guessResult[0].division,
                            conference: guessResult[0].conference,
                        },
                    },
                ],
            })

            setSelectedPlayer(null)
            setGuessResults(existingGuesses)
            if (guessResult[0].player_id == potd?.player_id) {
                setGuessedCorrectly(true)
                endGameWithAnimationDelay(true)
                localStorage.setItem('turfle-wl', 'W')
                return
            }
            if (existingGuesses.length === guessLimit) {
                setGuessedCorrectly(false)
                setTimeout(() => {
                    existingGuesses.push(potdGuessRow)
                    setGuessResults(existingGuesses)
                    endGameWithAnimationDelay(false)
                    localStorage.setItem('turfle-wl', 'L')
                }, standardDelayMs * 4)
                return
            }
        }
    }, [submitGuess.isSuccess])

    async function handleGuess() {
        if (!selectedPlayer) return
        if (
            guessResults.find(
                (x) => x.guessedPlayer.playerId === selectedPlayer.playerId
            )
        ) {
            console.error('already guessed this guy state')
            return
        }

        localStorage.setItem(
            'turfle-time',
            Math.floor(Date.now() / 1000).toString()
        )
        //@ts-expect-error -- ? some react-query type issue when passing multiple parameters to useMutation
        await submitGuess.mutateAsync({
            playerId: selectedPlayer.playerId,
            date: potdDate,
        })
    }

    function handleHowToPlayClose() {
        localStorage.setItem('turfle-how-to-play', 'true')
        setShowHowToPlayModal(false)
    }

    function endGameWithAnimationDelay(isWin: boolean) {
        //wait for animations to play out plus a little extra time to process result, then show game over modal
        setIsGameOver(true)
        setTimeout(() => {
            setShowGameOverModal(true)
        }, standardDelayMs * 4 + additionalGameOverDelayMs)
    }
    //used to pass style to MUI guess input inputProps
    const inputStyle = {
        fontFamily: "'Rubik', sans-serif",
        fontWeight: 400,
        fontStyle: 'normal',
    }
    return (
        <div className="flex h-screen w-full rubik-font-dropdown">
            {!getAllPlayersLoading && (
                <div className="m-auto flex gap-4 flex-col mobile:w-full">
                    <div className="italic text-white  mx-auto bebas-neue-title text-8xl">
                        TURFLE
                    </div>
                    <GuessResultTable guesses={guessResults}></GuessResultTable>
                    <div className="flex mb-4 gap-5 mx-auto">
                        {[...Array(guessLimit)].map((_e, i) => (
                            <div
                                key={`guess_counter_${i + 1}`}
                                className={`w-5 h-2 ${
                                    guessResults.length < i + 1
                                        ? 'opacity-30'
                                        : ''
                                } rounded-md bg-white`}
                            ></div>
                        ))}
                    </div>
                    <Autocomplete
                        sx={{
                            minWidth: { mobile: '80%', tablet: 350 },
                            marginX: 'auto',
                        }}
                        disabled={isGameOver}
                        options={playerValues ?? []}
                        onChange={(_e, newValue) => setSelectedPlayer(newValue)}
                        value={selectedPlayer}
                        inputValue={selectedPlayer?.name ?? autocompleteInput}
                        onKeyDown={(e) => {
                            if (e.key == 'Backspace') {
                                if (selectedPlayer) {
                                    setSelectedPlayer(null)
                                    setAutocompleteInput('')
                                }
                            }
                        }}
                        onInputCapture={(e) =>
                            //@ts-expect-error
                            setAutocompleteInput(e.target.value)
                        }
                        open={autocompleteInput.length > 2 && !selectedPlayer}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <div
                                key={`autocomplete_${option.playerId}`}
                                className="rubik-font-dropdown"
                            >
                                <Box
                                    component="li"
                                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                    {...props}
                                >
                                    <img
                                        loading="eager"
                                        width="28"
                                        src={`${window.location.href}/logos/${option.logoUrl}`}
                                    />
                                    | {option.name} | {option.position}
                                </Box>
                            </div>
                        )}
                        renderInput={(params) => (
                            <TextField
                                sx={{
                                    fontFamily: 'inherit',
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                }}
                                {...params}
                                placeholder="Start typing a Player to start"
                                inputProps={{
                                    ...params.inputProps,
                                    style: inputStyle,
                                }}
                            />
                        )}
                    />
                    <div className="mx-auto updated-date-text text-white text-center italic">
                        Player data (age, team, etc) last updated 03/20/2024
                    </div>
                    <div className="flex mx-auto relative mobile:mb-10">
                        <Button
                            sx={{
                                marginTop: 2,
                                padding: 2,
                                minWidth: '10rem',
                            }}
                            variant="contained"
                            color="primary"
                            onClick={handleGuess}
                            disabled={submitGuess.isLoading || isGameOver}
                        >
                            <span className="bebas-neue-regular text-2xl">
                                Guess
                            </span>
                        </Button>
                        <div className="absolute flex left-48 top-12 justify-between w-20 cursor-pointer">
                            <svg
                                onClick={() => setShowHowToPlayModal(true)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.75}
                                stroke="white"
                                className="w-8 h-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.75}
                                stroke="white"
                                className="w-8 h-8"
                                onClick={() => setShowInfoModal(true)}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
            {/* last ditch effort to fix logo pop-in if file downsizing isn't enough - load all the images and hide them */}
            {/* {imageSrcs.map((img) => (
                <img
                    className="hidden"
                    src={`${window.location.href}/logos/${img}`}
                ></img>
            ))} */}
            <GuessContext.Provider value={guessResults}>
                <EndGamePopUp
                    guesses={guessResults.length}
                    guessLimit={guessLimit}
                    potdName={potd?.name ?? ''}
                    isOpen={showGameOverModal}
                    correct={guessedCorrectly}
                    onClose={() => setShowGameOverModal(false)}
                ></EndGamePopUp>
            </GuessContext.Provider>
            <HowToPlayPopup
                isOpen={showHowToPlayModal}
                onClose={() => handleHowToPlayClose()}
            ></HowToPlayPopup>
            <InfoPopup
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
            ></InfoPopup>
        </div>
    )
}
