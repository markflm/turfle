import { useMutation, useQuery } from 'react-query'
import { getAllPlayers } from './db/supabase-client'

export default function GameTable() {
    const { data: players, isLoading: playersLoading } = useQuery(
        ['all_players'],
        async () => {
            return await getAllPlayers()
        }
    )

    // const sendGuess = useMutation(

    // })

    console.log('all players')
    console.log(players)
    return <div>game table</div>
}
