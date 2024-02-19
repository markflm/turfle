import { useMutation, useQuery } from 'react-query'
import { getAllPlayers } from './db/supabase-client'
import { Autocomplete, Box, TextField } from '@mui/material'
import GuessResultTable from './GuessResultTable'
import { PlayerOption } from './types/PlayerOption'
import { useState } from 'react'

export default function GameTable() {
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
        null
    )

    const { data: playerValues, isLoading: playersLoading } = useQuery(
        ['all_players'],
        async () => {
            return await getAllPlayers()
        }
    )

    // const sendGuess = useMutation(

    // })

    // console.log('all players')
    // console.log(playerValues)
    return (
        <div className="flex h-full">
            <div className="m-auto">
                <GuessResultTable></GuessResultTable>
                <Autocomplete
                    sx={{ width: 300, marginX: '25%' }}
                    options={playerValues ?? []}
                    autoHighlight
                    onChange={(e, newValue) => setSelectedPlayer(newValue)}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...props}
                        >
                            <img
                                loading="eager"
                                width="20"
                                src={option.logoUrl}
                                alt=""
                            />
                            | {option.name} | {option.position}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            sx={{ bgcolor: 'whitesmoke', borderRadius: 2 }}
                            {...params}
                            placeholder="Select a Player"
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}
                />
            </div>
        </div>
    )
}
