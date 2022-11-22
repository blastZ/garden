import { Global } from '@emotion/react';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { LightBasic } from './app/LightBasic';
import { ParticleBasic } from './app/ParticleBasic';
import { RaycasterBasic } from './app/RaycasterBasic';
import { ShadowBasic } from './app/ShadowBasic';
import { TextDemo } from './app/TextDemo';
import { TextureBasic } from './app/TextureBasic';
import { TextureDemo } from './app/TextureDemo';

import { globalCss } from './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const examples = {
  '/texture-basic': <TextureBasic />,
  '/texture-demo': <TextureDemo />,
  '/text-demo': <TextDemo />,
  '/light-basic': <LightBasic />,
  '/shadow-basic': <ShadowBasic />,
  '/particle-basic': <ParticleBasic />,
  '/raycaster-basic': <RaycasterBasic />,
};

root.render(
  <StrictMode>
    <BrowserRouter>
      <Global styles={globalCss} />
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{ display: 'flex', flexDirection: 'column', padding: 32 }}
            >
              {Object.keys(examples).map((path) => (
                <Link style={{ marginTop: 16 }} key={path} to={path}>
                  {path}
                </Link>
              ))}
            </div>
          }
        />
        {Object.entries(examples).map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
