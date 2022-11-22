import { useEffect, useRef } from 'react';
import * as T from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Container } from '../components/Container';
import { MountContainer } from '../components/MountContainer';
import { useRenderer } from '../hooks/use-renderer';

export function ModelBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
    });

    renderer.camera.position.set(3, 8, 8);

    const planeGeometry = new T.PlaneGeometry(6, 6);
    const planeMaterial = new T.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.7,
    });
    const plane = new T.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;

    const light = new T.AmbientLight('#ffffff', 0.3);
    const light2 = new T.DirectionalLight('#ffffff', 0.7);

    let foxMixer: T.AnimationMixer;

    const gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/libs/draco/');

    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load('assets/models/Duck/glTF/Duck.gltf', (gltf) => {
      renderer.addToScene(gltf.scene);
    });

    gltfLoader.load('assets/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
      renderer.addToScene(gltf.scene);

      gltf.scene.position.z = 2;
    });

    gltfLoader.load('assets/models/Fox/glTF/Fox.gltf', (gltf) => {
      console.log(gltf);

      renderer.addToScene(gltf.scene);

      gltf.scene.scale.setScalar(0.025);
      gltf.scene.position.x = 2;

      foxMixer = new T.AnimationMixer(gltf.scene);

      const action = foxMixer.clipAction(gltf.animations[0]);

      action.play();
    });

    renderer.addToScene(plane, light, light2);

    const clock = new T.Clock();

    let reqId: number;
    const tick = () => {
      if (foxMixer) {
        foxMixer.update(clock.getDelta());
      }

      reqId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      renderer.unmount();
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <Container>
      <MountContainer ref={mountRef}></MountContainer>
    </Container>
  );
}
