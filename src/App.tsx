import { QueryClient, QueryClientProvider } from 'react-query'
import GameTable from './GameTable'
import { ThemeProvider } from '@emotion/react'
import { theme } from './styles/mui-theme'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <div className="bg-gradient-to-t from-slate-900 to-slate-700 from-10% w-screen h-screen">
                    <GameTable />
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
