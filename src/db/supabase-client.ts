import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { PlayerOption } from '../types/PlayerOption'

const supabaseUrl = import.meta.env.VITE_SUPABASE_API_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

type dbTeam = Database['public']['Tables']['teams']['Row']
type dbPlayer = Database['public']['Tables']['players']['Row']
type dbPosition = Database['public']['Tables']['positions']['Row']

export const supaClient = createClient<Database>(supabaseUrl, supabaseKey)

export async function checkGuess(playerId: number) {
    const { data, error } = await supaClient.rpc('checkguess', {
        guess_id: playerId,
    })
    console.error(error)
    return data
}

//todo - add error handling
export async function getAllPlayers() {
    const playersRaw = await supaClient
        .from('players')
        .select(`id, name, positions (*), teams (*)`)
        .returns<(dbPlayer & { positions: dbPosition } & { teams: dbTeam })[]>()

    return playersRaw.data?.map((data) => {
        return {
            logoUrl: data.teams.logo_url,
            name: data.name,
            position: data.positions.name,
            playerId: data.id,
        } as PlayerOption
    })
}
