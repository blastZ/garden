import styled from '@emotion/styled';
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

export function RaycasterBasic() {
  const mountRef = useRef<HTMLDivElement>(null);
  const renderer = useRenderer();

  useEffect(() => {
    renderer.init(mountRef, {
      orbitControls: true,
    });

    const geometry = new T.SphereGeometry(0.5, 16, 16);

    const material1 = new T.MeshBasicMaterial({
      color: 'pink',
    });
    const obj1 = new T.Mesh(geometry, material1);
    obj1.position.set(-2, 0, 0);

    const material2 = new T.MeshBasicMaterial({
      color: 'pink',
    });
    const obj2 = new T.Mesh(geometry, material2);

    const material3 = new T.MeshBasicMaterial({
      color: 'pink',
    });
    const obj3 = new T.Mesh(geometry, material3);
    obj3.position.set(2, 0, 0);

    const objects = [obj1, obj2, obj3];

    const raycaster = new T.Raycaster();

    const mousePosition = new T.Vector2(-1, -1);

    const mountEle = mountRef.current;
    const listener = (e: MouseEvent) => {
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();

        mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePosition.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    mountEle?.addEventListener('mousemove', listener);

    const clickRaycaster = new T.Raycaster();
    const clickListener = (e: MouseEvent) => {
      const position = new T.Vector2(-1, -1);

      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();

        position.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        position.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }

      clickRaycaster.setFromCamera(position, renderer.camera);

      const intersections = clickRaycaster.intersectObjects(objects);

      intersections.map((intersection: any) => {
        const { object } = intersection;

        object.position.y += 0.1;
      });
    };
    mountEle?.addEventListener('click', clickListener);

    let reqId: number;
    const tick = () => {
      raycaster.setFromCamera(mousePosition, renderer.camera);

      objects.map((object) => {
        object.material.color = new T.Color('pink');
      });

      const intersections = raycaster.intersectObjects(objects);

      intersections.map((intersection: any) => {
        const { object } = intersection;

        object.material.color = new T.Color('green');
      });

      reqId = requestAnimationFrame(tick);
    };

    tick();

    renderer.addToScene(obj1, obj2, obj3);

    return () => {
      renderer.unmount();

      mountEle?.removeEventListener('mousemove', listener);
      mountEle?.removeEventListener('click', clickListener);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <Container>
      <MountContainer ref={mountRef}></MountContainer>
    </Container>
  );
}
