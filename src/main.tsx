import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useStore } from './lib/store'
import { initializeStoreWithSampleData } from './lib/sampleData'

// Initialize store with sample data if it's empty
const store = useStore.getState();
if (store.expenses.length === 0 && store.incomes.length === 0) {
  initializeStoreWithSampleData(useStore);
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}