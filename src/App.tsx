import { QueryClient, QueryClientProvider } from 'react-query'
import GameTable from './GameTable'
import { ThemeProvider } from '@emotion/react'
import { theme } from './styles/mui-theme'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <div className="w-screen tablet:h-screen mobile:min-h-screen">
                    <GameTable />
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
