import './App.css';
import AutocompleteInput from './components/autocomplete-input/AutocompleteInput';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <AutocompleteInput />
      </div>
    </QueryClientProvider>
  );
}

export default App;
