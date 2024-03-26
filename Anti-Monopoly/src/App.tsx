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

// Vytvoření routeru s nevnořenými cestami
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<MainMenu />} />,
    <Route path="choicemenu" element={<ChoiceMenu />} />,
    <Route path="rules" element={<Rules />} />,
    <Route path="*" element={<ErrorPage />} />]  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
