import { useMutation, useQuery } from 'react-query'
import { checkGuess, getAllPlayers, getPotd } from './db/supabase-client'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import GuessResultTable from './GuessResultTable'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useState } from 'react'
import { GuessRow } from './GuessResultTableRow'
import { CategoryStatus } from './types/Answer'
import { standardDelayMs } from './utils/global'

const guessLimit = 2

export default function GameTable() {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
        null
    )
    const [guessResults, setGuessResults] = useState<GuessRow[]>([])
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [autocompleteInput, setAutocompleteInput] = useState<string>('')

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
            return await getPotd()
        },
        { staleTime: 1000 * 60 * 5 }
    )

    const submitGuess = useMutation(checkGuess)

    useEffect(() => {
        const lastExistingGuess = localStorage.getItem('turfle-time')
        //if you have guesses but they're older than midnight yesterday (EST), clear your localstorage
        if (lastExistingGuess) {
            const d = new Date()
            d.setHours(0, 0, 0, 0)
            if (parseInt(lastExistingGuess) < d.valueOf()) {
                localStorage.clear()
            }
            const existingGuesses = localStorage.getItem('turfle-guesses')
            if (existingGuesses) {
                //todo - maybe check that existingGuesses haven't been tampered with
                setGuessResults(JSON.parse(existingGuesses))
            }
        }
    }, [])

    useEffect(() => {
        if (guessResults.length) {
            localStorage.setItem('turfle-guesses', JSON.stringify(guessResults))
            localStorage.setItem('turfle-time', Date.now().toString())
        }

        if (guessResults.length == guessLimit) {
            console.log('games over pal')
            console.log('potd')
            console.log(potd)
            // if (!potd) return
            // const existingGuesses = [...guessResults]
            // const pullPlayerFromAllPlayers = playerValues?.find(
            //     (x) => x.playerId == potd.player_id
            // )
            // if (!pullPlayerFromAllPlayers) return
            // existingGuesses.push({
            //     guessedPlayer: pullPlayerFromAllPlayers,
            //     guessAnswers: [
            //         {
            //             category: 'team',
            //             status: 'correct',
            //             value: potd.team_name,
            //         },
            //         {
            //             category: 'age',
            //             status: 'correct',
            //             value: potd.age,
            //         },
            //         {
            //             category: 'position',
            //             status: 'correct',
            //             value: potd.position_name,
            //         },
            //     ],
            // })
            //trigger game over sequence

            setIsGameOver(true)
            // setTimeout(() => {
            //     setGuessResults(existingGuesses)
            // }, standardDelayMs * 4)
        }
        if (guessResults.length > guessLimit) return
    }, [guessResults])

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
                        value: guessResult[0].position_name,
                    },
                    {
                        category: 'team',
                        status: guessResult[0].team_answer as CategoryStatus,
                        value: guessResult[0].team_name,
                    },
                ],
            })
            setSelectedPlayer(null)
            setGuessResults(existingGuesses)
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
        await submitGuess.mutateAsync(selectedPlayer.playerId)
    }

    //used to pass style to MUI guess input inputProps
    const inputStyle = {
        fontFamily: "'Rubik', sans-serif",
        fontWeight: 400,
        fontStyle: 'normal',
    }
    return (
        <div className="flex h-full rubik-font-dropdown">
            {!getAllPlayersLoading && (
                <div className="m-auto flex flex-col">
                    <GuessResultTable guesses={guessResults}></GuessResultTable>
                    <div className="flex mb-4 gap-5 mx-auto">
                        <div
                            className={`w-5 h-2 ${
                                guessResults.length < 1 ? 'opacity-30' : ''
                            } rounded-md bg-white`}
                        ></div>
                        <div
                            className={`w-5 h-2 ${
                                guessResults.length < 2 ? 'opacity-30' : ''
                            } rounded-md bg-white`}
                        ></div>
                        <div
                            className={`w-5 h-2 ${
                                guessResults.length < 3 ? 'opacity-30' : ''
                            } rounded-md bg-white`}
                        ></div>
                        <div
                            className={`w-5 h-2 ${
                                guessResults.length < 4 ? 'opacity-30' : ''
                            } rounded-md bg-white`}
                        ></div>
                        <div
                            className={`w-5 h-2 ${
                                guessResults.length < 5 ? 'opacity-30' : ''
                            } rounded-md bg-white`}
                        ></div>
                    </div>
                    <Autocomplete
                        sx={{ width: 300, marginX: 'auto' }}
                        options={playerValues ?? []}
                        onChange={(e, newValue) => setSelectedPlayer(newValue)}
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
                                        width="32"
                                        src={`${window.location.href}/logos/${option.logoUrl}`}
                                        alt=""
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
                                placeholder="Select a Player"
                                inputProps={{
                                    ...params.inputProps,
                                    style: inputStyle,
                                }}
                            />
                        )}
                    />
                    <Button
                        sx={{
                            marginX: 'auto',
                            marginTop: 2,
                            padding: 2,
                            minWidth: '10rem',
                        }}
                        variant="contained"
                        onClick={handleGuess}
                        disabled={submitGuess.isLoading}
                    >
                        <span className="rubik-font-dropdown">Guess</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
