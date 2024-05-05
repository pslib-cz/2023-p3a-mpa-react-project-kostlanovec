import {} from 'react';
import './App.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainMenu from './components/MainMenu/MainMenu.tsx';
import ChoiceMenu from './components/ChoiceMenu/ChoiceMenu.tsx';
import Rules from './components/Rules/Rules.tsx';
import ErrorPage from './error-page.tsx';
import Playing from './components/Playing/Playing.tsx';
import { PlayingProvider } from './providers/PlayingProvider.tsx';
import Winning from './components/Winning/Winning.tsx';

// Vytvoření routeru s nevnořenými cestami
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<MainMenu />} />,
    <Route path="choicemenu" element={<PlayingProvider><ChoiceMenu /></PlayingProvider>} />,
    <Route path="rules" element={<Rules />} />,
    <Route path="*" element={<ErrorPage />} />,
    <><Route path="playing" element={<PlayingProvider><Playing /></PlayingProvider>} />
    <Route path="winning" element={<PlayingProvider><Winning /></PlayingProvider>} /></>
  ])
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
