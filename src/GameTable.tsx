import { useMutation, useQuery } from 'react-query'
import { getAllPlayers } from './db/supabase-client'
import { Autocomplete, Box, TextField } from '@mui/material'

export default function GameTable() {
    const { data: playerValues, isLoading: playersLoading } = useQuery(
        ['all_players'],
        async () => {
            return await getAllPlayers()
        }
    )

    // const sendGuess = useMutation(

    // })

    console.log('all players')
    console.log(playerValues)
    return (
        <div>
            <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                options={playerValues ?? []}
                autoHighlight
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
                        {...params}
                        label="Choose a country"
                        inputProps={{
                            ...params.inputProps,
                            // autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
            />
        </div>
    )
}
