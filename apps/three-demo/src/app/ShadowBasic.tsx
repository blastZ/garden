import GUI from 'lil-gui';
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { Container } from '../components/Container';
import { MountContainer } from '../components/MountContainer';
import { useRenderer } from '../hooks/use-renderer';

export function ShadowBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
      shadowMap: true,
    });

    renderer.camera.position.set(2, 4, 5);

    const gui = new GUI();

    const material = new T.MeshStandardMaterial({
      roughness: 0.6,
    });

    const planeGeometry = new T.PlaneGeometry(6, 6);
    const planeMesh = new T.Mesh(planeGeometry, material);
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.receiveShadow = true;

    const sphereGeometry = new T.SphereGeometry(0.5);
    const sphereMesh = new T.Mesh(sphereGeometry, material);
    sphereMesh.position.set(0, 1.5, 0);
    sphereMesh.castShadow = true;

    renderer.addToScene(planeMesh, sphereMesh);

    const ambientLight = new T.AmbientLight(undefined, 0.3);

    const directionalLight = new T.DirectionalLight('#ffffff');
    directionalLight.position.set(2, 3, 0);
    directionalLight.intensity = 0.3;
    directionalLight.castShadow = false;
    const directionalLgithHelper = new T.DirectionalLightHelper(
      directionalLight,
      0.5
    );
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;

    renderer.renderer.shadowMap.type = T.PCFSoftShadowMap;
    // directionalLight.shadow.radius = 10;

    const directionalCameraHelper = new T.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalCameraHelper.visible = false;

    const pointLight = new T.PointLight(0xffffff);
    pointLight.position.set(1, 3, -1);
    pointLight.intensity = 0.3;
    const pointLightHelepr = new T.PointLightHelper(pointLight, 0.2);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 10;

    const pointLightCameraHelper = new T.CameraHelper(pointLight.shadow.camera);
    pointLightCameraHelper.visible = false;

    const spotLight = new T.SpotLight(0xffffff);
    spotLight.position.set(1, 4, 1.5);
    spotLight.intensity = 0.1;
    spotLight.castShadow = false;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.fov = 60;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;

    const spotLightHelper = new T.SpotLightHelper(spotLight);

    const spotLightCameraHelper = new T.CameraHelper(spotLight.shadow.camera);
    spotLightCameraHelper.visible = false;

    renderer.addToScene(
      ambientLight,
      directionalLight,
      directionalLgithHelper,
      directionalCameraHelper,
      pointLight,
      pointLightHelepr,
      pointLightCameraHelper,
      spotLight,
      spotLightHelper,
      spotLightCameraHelper
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

    const folder = gui.addFolder('pointLight');
    folder.add(pointLight, 'intensity').min(0).max(1).step(0.01);
    folder.add(pointLight, 'distance').min(0).max(10).step(0.01);
    folder.add(pointLight, 'decay').min(0).max(10).step(0.01);

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
