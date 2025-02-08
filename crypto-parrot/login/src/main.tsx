import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init } from './init.ts';

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

init(retrieveLaunchParams().startParam === 'debug');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
