import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import MainLayout from './components/Layout/MainLayout';
import RecipeList from './components/Recipe/RecipeList';
import InventoryManager from './components/Inventory/InventoryManager';
import CraftingCalculator from './components/Calculator/CraftingCalculator';
import './styles/globals.css';
import store from './store';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Provider store={store}>
    <Router>
      <Header />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to='/recipes' replace />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/inventory" element={<InventoryManager />} />
          <Route path="/calculator" element={<CraftingCalculator />} />
        </Routes>
      </MainLayout>
    </Router>
    </Provider>
  );
}

export default App;