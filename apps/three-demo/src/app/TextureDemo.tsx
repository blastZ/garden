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

export function TextureDemo() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
    });

    const guiData = {
      colorTexture: false,
      alphaTexture: false,
      aoTexture: false,
      heightTexture: false,
      metalnessTexture: false,
      roughnessTexture: false,
      normalTexture: false,
    };

    const gui = new GUI();

    const geometry = new T.PlaneGeometry(5, 5, 100, 100);
    const material = new T.MeshStandardMaterial();
    const door = new T.Mesh(geometry, material);

    const textureLoader = new T.TextureLoader();
    const pre = 'assets/textures/door/';
    const colorTexture = textureLoader.load(pre + 'base-color.jpg');
    const alphaTexture = textureLoader.load(pre + 'opacity.jpg');
    const aoTexture = textureLoader.load(pre + 'ambient-occlusion.jpg');
    const heightTexture = textureLoader.load(pre + 'height.png');
    const metalnessTexture = textureLoader.load(pre + 'metallic.jpg');
    const roughnessTexture = textureLoader.load(pre + 'roughness.jpg');
    const normalTexture = textureLoader.load(pre + 'normal.jpg');

    material.transparent = true;
    material.side = T.DoubleSide;

    gui.add(guiData, 'colorTexture').onChange((v: boolean) => {
      if (v) {
        material.map = colorTexture;
      } else {
        material.map = null;
      }

      material.needsUpdate = true;
    });

    gui.add(guiData, 'alphaTexture').onChange((v: boolean) => {
      if (v) {
        material.alphaMap = alphaTexture;
      } else {
        material.alphaMap = null;
      }

      material.needsUpdate = true;
    });

    gui.add(guiData, 'aoTexture').onChange((v: boolean) => {
      if (v) {
        material.aoMap = aoTexture;
      } else {
        material.aoMap = null;
      }

      material.needsUpdate = true;
    });

    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01);

    gui.add(guiData, 'heightTexture').onChange((v: boolean) => {
      if (v) {
        material.displacementMap = heightTexture;
      } else {
        material.displacementMap = null;
      }

      material.needsUpdate = true;
    });

    material.displacementScale = 0.3;
    gui.add(material, 'displacementScale').min(0).max(5).step(0.01);

    gui.add(guiData, 'metalnessTexture').onChange((v: boolean) => {
      if (v) {
        material.metalnessMap = metalnessTexture;
      } else {
        material.metalnessMap = null;
      }

      material.needsUpdate = true;
    });
    gui.add(material, 'metalness').min(0).max(1).step(0.01);

    gui.add(guiData, 'roughnessTexture').onChange((v: boolean) => {
      if (v) {
        material.roughnessMap = roughnessTexture;
      } else {
        material.roughnessMap = null;
      }

      material.needsUpdate = true;
    });
    gui.add(material, 'roughness').min(0).max(5).step(0.01);

    gui.add(guiData, 'normalTexture').onChange((v: boolean) => {
      if (v) {
        material.normalMap = normalTexture;
      } else {
        material.normalMap = null;
      }

      material.needsUpdate = true;
    });

    const ambientLight = new T.AmbientLight();
    const pointLight = new T.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);

    geometry.setAttribute(
      'uv2',
      new T.BufferAttribute(door.geometry.getAttribute('uv').array, 2)
    );

    renderer.addToScene(ambientLight, pointLight, door);

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
