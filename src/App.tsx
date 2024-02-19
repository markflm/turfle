import { QueryClient, QueryClientProvider } from 'react-query'
import GameTable from './GameTable'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-gray-600 w-screen h-screen">
                <GameTable />
            </div>
        </QueryClientProvider>
    )
}

export default App
