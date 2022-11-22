import { useEffect, useRef } from 'react';
import * as T from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { Container } from '../components/Container';
import { MountContainer } from '../components/MountContainer';
import { useRenderer } from '../hooks/use-renderer';

export function TextDemo() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    const init = async () => {
      renderer.init(mountRef, {
        orbitControls: true,
      });

      const fontLoader = new FontLoader();
      const font = await new Promise<Font>((resolve) => {
        fontLoader.load(
          'assets/fonts/gentilis_regular.typeface.json',
          (loaded) => {
            resolve(loaded);
          }
        );
      });

      const textureLoader = new T.TextureLoader();
      const matcapTexture = textureLoader.load('assets/textures/matcaps/8.png');

      const material = new T.MeshMatcapMaterial();
      material.matcap = matcapTexture;

      const textGeometry = new TextGeometry('Hello Text Demo', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      textGeometry.center();

      const textMesh = new T.Mesh(textGeometry, material);

      const donutGeometry = new T.TorusGeometry(0.3, 0.2, 20, 45);

      const donuts = new Array(100).fill(0).map(() => {
        const donut = new T.Mesh(donutGeometry, material);

        donut.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        donut.scale.setScalar(Math.random());

        return donut;
      });

      renderer.addToScene(textMesh, ...donuts);
    };

    init();

    return () => {
      renderer.unmount();
    };
  }, []);

  return (
    <Container>
      <MountContainer ref={mountRef}></MountContainer>
    </Container>
  );
}
