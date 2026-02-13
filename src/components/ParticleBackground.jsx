import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 100 }) => {
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            const scale = Math.random() * 0.5 + 0.1;
            const speed = Math.random() * 0.02 + 0.005;
            temp.push({ x, y, z, scale, speed });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.0005;

            particles.forEach((particle, i) => {
                const i3 = i * 3;
                mesh.current.geometry.attributes.position.array[i3 + 1] += particle.speed;

                if (mesh.current.geometry.attributes.position.array[i3 + 1] > 10) {
                    mesh.current.geometry.attributes.position.array[i3 + 1] = -10;
                }
            });

            mesh.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    const positions = new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]));
    const scales = new Float32Array(particles.map(p => p.scale));

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-scale"
                    count={particles.length}
                    array={scales}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#ff1493"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const ParticleBackground = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none',
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Particles count={150} />
            </Canvas>
        </div>
    );
};

export default ParticleBackground;
