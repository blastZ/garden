import { Global } from '@emotion/react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LightBasic } from './app/LightBasic';

import { globalCss } from './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Global styles={globalCss} />
      {/* <TextureBasic /> */}
      {/* <TextureDemo /> */}
      {/* <TextDemo /> */}
      <LightBasic />
    </BrowserRouter>
  </StrictMode>
);
