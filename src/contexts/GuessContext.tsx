import { createContext } from 'react'
import { GuessRow } from '../GuessResultTableRow'

export const GuessContext = createContext<GuessRow[]>([])
