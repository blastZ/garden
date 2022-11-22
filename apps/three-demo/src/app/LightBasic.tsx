import GUI from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import { Container } from '../components/Container';
import { MountContainer } from '../components/MountContainer';
import { useRenderer } from '../hooks/use-renderer';

export function LightBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
    });

    renderer.camera.position.set(2, 4, 5);

    const gui = new GUI();

    const material = new T.MeshStandardMaterial();

    const planeGeometry = new T.PlaneGeometry(6, 6);
    const planeMaterial = new T.MeshStandardMaterial({ side: T.DoubleSide });
    const planeMesh = new T.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;

    const cubeGeometry = new T.BoxGeometry(1, 1, 1);
    const cubeMesh = new T.Mesh(cubeGeometry, material);
    cubeMesh.position.set(0, 1.5, 0);

    const sphereGeometry = new T.SphereGeometry(0.5);
    const sphereMesh = new T.Mesh(sphereGeometry, material);
    sphereMesh.position.set(-2, 1.5, 0);

    const torusGeometry = new T.TorusGeometry(0.5, 0.1, 16, 30);
    const torusMesh = new T.Mesh(torusGeometry, material);
    torusMesh.position.set(2, 1.5, 0);

    renderer.addToScene(planeMesh, cubeMesh, sphereMesh, torusMesh);

    const ambientLight = new T.AmbientLight(undefined, 0.5);

    const directionalLight = new T.DirectionalLight(new T.Color('blue'));
    directionalLight.position.set(0, 3, 0);
    directionalLight.intensity = 0;
    const directionalLgithHelper = new T.DirectionalLightHelper(
      directionalLight,
      0.5
    );

    const hemisphereLight = new T.HemisphereLight(
      new T.Color('red'),
      new T.Color('green')
    );
    hemisphereLight.position.set(0, 3, 0);
    hemisphereLight.intensity = 0;
    const hemisphereLightHelper = new T.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );

    const pointLight = new T.PointLight(0xff9000);
    pointLight.position.set(1, 0.5, 0.5);
    pointLight.intensity = 0;
    const pointLightHelepr = new T.PointLightHelper(pointLight, 0.2);

    const rectAreaLight = new T.RectAreaLight(0x4e00ff, 1, 2, 2);
    rectAreaLight.position.set(0, 1, 2);
    rectAreaLight.intensity = 0;
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);

    const spotLight = new T.SpotLight(0x78ff00);
    spotLight.position.set(2, 1, 2);
    spotLight.intensity = 0;
    const spotLightHelper = new T.SpotLightHelper(spotLight);

    renderer.addToScene(
      ambientLight,
      directionalLight,
      directionalLgithHelper,
      hemisphereLight,
      hemisphereLightHelper,
      pointLight,
      pointLightHelepr,
      rectAreaLight,
      rectAreaLightHelper,
      spotLight,
      spotLightHelper
    );

    gui
      .add(ambientLight, 'intensity')
      .name('ambientLight')
      .min(0)
      .max(1)
      .step(0.01);
    gui
      .add(directionalLight, 'intensity')
      .name('directionalLight')
      .min(0)
      .max(1)
      .step(0.01);
    gui
      .add(hemisphereLight, 'intensity')
      .name('hemisphereLight')
      .min(0)
      .max(1)
      .step(0.01);

    const folder = gui.addFolder('pointLight');
    folder.add(pointLight, 'intensity').min(0).max(1).step(0.01);
    folder.add(pointLight, 'distance').min(0).max(10).step(0.01);
    folder.add(pointLight, 'decay').min(0).max(10).step(0.01);

    gui
      .add(rectAreaLight, 'intensity')
      .name('rectAreaLight')
      .min(0)
      .max(1)
      .step(0.01);
    gui.add(spotLight, 'intensity').name('spotLight').min(0).max(1).step(0.01);

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
