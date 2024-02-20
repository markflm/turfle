import { useMutation, useQuery } from 'react-query'
import { checkGuess, getAllPlayers } from './db/supabase-client'
import { Autocomplete, Box, Button, TextField } from '@mui/material'
import GuessResultTable from './GuessResultTable'
import { PlayerOption } from './types/PlayerOption'
import { useEffect, useState } from 'react'
import { GuessRow } from './GuessResultTableRow'
import { CategoryStatus } from './types/Answer'

const guessLimit = 4

export default function GameTable() {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
        null
    )
    const [guessResults, setGuessResults] = useState<GuessRow[]>([])

    const { data: playerValues, isLoading: getAllPlayersLoading } = useQuery(
        ['all_players'],
        async () => {
            return await getAllPlayers()
        }
    )

    const submitGuess = useMutation(checkGuess)

    useEffect(() => {
        if (guessResults.length >= guessLimit) {
            console.log('games over pal')
            //trigger game over sequence
        }
    }, [guessResults])

    useEffect(() => {
        if (submitGuess.isSuccess) {
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

    // console.log('all players')
    // console.log(playerValues)

    async function handleGuess() {
        if (!selectedPlayer) return
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
                    <Autocomplete
                        sx={{ width: 300, marginX: 'auto' }}
                        options={playerValues ?? []}
                        autoHighlight
                        onChange={(e, newValue) => setSelectedPlayer(newValue)}
                        value={selectedPlayer}
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
                        <span className="rubik-font-dropdown"> Guess</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
