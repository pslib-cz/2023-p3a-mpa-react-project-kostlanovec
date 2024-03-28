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
import SettingsProvider from './providers/SettingsProvider.tsx';
import { PlayingProvider } from './providers/PlayingProvider.tsx';

// Vytvoření routeru s nevnořenými cestami
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<MainMenu />} />,
    // Obalení komponenty ChoiceMenu a Playing v SettingsProvider
    <Route path="choicemenu" element={<SettingsProvider><ChoiceMenu /></SettingsProvider>} />,
    <Route path="rules" element={<Rules />} />,
    <Route path="*" element={<ErrorPage />} />,
    <Route path="playing" element={<SettingsProvider><PlayingProvider><Playing /></PlayingProvider></SettingsProvider>} />
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
