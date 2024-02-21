import { QueryClient, QueryClientProvider } from 'react-query'
import GameTable from './GameTable'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-gradient-to-t from-slate-900 to-slate-700 w-screen h-screen">
                <GameTable />
            </div>
        </QueryClientProvider>
    )
}

export default App
