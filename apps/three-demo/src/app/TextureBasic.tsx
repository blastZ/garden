import GUI from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { Container } from '../components/Container';
import { MountContainer } from '../components/MountContainer';
import { useRenderer } from '../hooks/use-renderer';

export function TextureBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      axesHelper: 50,
      orbitControls: true,
    });

    const geometry = new T.BoxGeometry(1, 1, 1);
    const material = new T.MeshBasicMaterial({
      wireframe: false,
    });
    const cube = new T.Mesh(geometry, material);

    const gui = new GUI();

    gui.addColor(material, 'color');
    gui.add(material, 'wireframe');

    const folder = gui.addFolder('Position');
    folder.close();
    folder.add(cube.position, 'x').min(-3).max(3).step(0.01);
    folder.add(cube.position, 'y').min(-3).max(3).step(0.01);
    folder.add(cube.position, 'z').min(-3).max(3).step(0.01);

    const folder2 = gui.addFolder('Rotation');
    folder2.close();
    folder2.add(cube.rotation, 'x').min(-3).max(3).step(0.01);
    folder2.add(cube.rotation, 'y').min(-3).max(3).step(0.01);
    folder2.add(cube.rotation, 'z').min(-3).max(3).step(0.01);

    const folder3 = gui.addFolder('Scale');
    folder3.close();
    folder3.add(cube.scale, 'x').min(1).max(3).step(0.01);
    folder3.add(cube.scale, 'y').min(1).max(3).step(0.01);
    folder3.add(cube.scale, 'z').min(1).max(3).step(0.01);

    const loadingManager = new T.LoadingManager();
    const textureLoader = new T.TextureLoader(loadingManager);

    const colorTexture = textureLoader.load(
      '/assets/textures/door/base-color.jpg'
      // '/assets/textures/checkerboard-8x8.png'
    );

    const folder4 = gui.addFolder('TextureRepeat');
    folder4.add(colorTexture.repeat, 'x').min(1).max(5).step(1);
    folder4.add(colorTexture.repeat, 'y').min(1).max(5).step(1);

    colorTexture.wrapS = T.RepeatWrapping;
    colorTexture.wrapT = T.RepeatWrapping;

    const folder5 = gui.addFolder('TextureOffset');
    folder5.add(colorTexture.offset, 'x').min(0).max(1).step(0.1);
    folder5.add(colorTexture.offset, 'y').min(0).max(1).step(0.1);

    gui
      .add(colorTexture, 'rotation')
      .name('TextRotation')
      .min(0)
      .max(2 * Math.PI)
      .step(0.1);

    colorTexture.center.x = 0.5;
    colorTexture.center.y = 0.5;

    // colorTexture.minFilter = T.NearestFilter;
    colorTexture.magFilter = T.NearestFilter;
    colorTexture.generateMipmaps = false;

    material.map = colorTexture;

    console.log(geometry.attributes['uv']);

    renderer.addToScene(cube);

    // gsap.to(cube.position, { x: 1, duration: 1, delay: 1 });

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
