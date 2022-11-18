import styled from '@emotion/styled';
import GUI from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { useRenderer } from '../hooks/use-renderer';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const MountContainer = styled.div`
  width: 100%;
  height: 600px;
`;

export function ParticleBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
    });

    renderer.camera.position.set(2, 4, 5);

    const gui = new GUI();

    const geometry = new T.BufferGeometry();

    const count = 5000;
    const vertices = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    geometry.setAttribute('position', new T.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new T.BufferAttribute(colors, 3));

    const material = new T.PointsMaterial();
    material.size = 0.08;
    material.sizeAttenuation = true;
    // material.color = new T.Color('pink');
    material.vertexColors = true;

    const textureLoader = new T.TextureLoader();
    const texture = textureLoader.load('assets/textures/particles/2.png');

    material.transparent = true;
    material.alphaMap = texture;

    // material.alphaTest = 0.001;
    // material.depthTest = false;
    material.depthWrite = false;

    material.blending = T.AdditiveBlending;

    const particles = new T.Points(geometry, material);

    const boxGeometry = new T.BoxGeometry(1, 1, 1);
    const boxMaterial = new T.MeshBasicMaterial();
    const box = new T.Mesh(boxGeometry, boxMaterial);

    const clock = new T.Clock();
    const tick = () => {
      particles.position.y = clock.getElapsedTime() * 0.05;

      requestAnimationFrame(tick);
    };
    tick();

    renderer.addToScene(particles);

    return () => {
      renderer.unmount();
      gui.destroy();
    };
  }, []);

  return (
    <Container>
      <MountContainer ref={mountRef}></MountContainer>
    </Container>
  );
}
