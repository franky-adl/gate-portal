import { OrbitControls, Sky, Environment, useFBO } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

import Sunset from "./assets/venice_sunset_1k.hdr";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const TransformPortal = () => {
    const torus = useRef();
    const box = useRef();
    const cylinder1 = useRef();
    const cylinder2 = useRef();

    // need to specify sRGB color space to fix coloring
    const renderTarget1 = useFBO();
    const renderTarget2 = useFBO();

    const uniforms = useMemo(
        () => ({
            uTexture: {
                value: null,
            },
            winResolution: {
                value: new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
            },
        }),
        []
    );

    useFrame((state) => {
        const { gl, scene, camera, clock } = state;

        cylinder1.current.material.forEach((material) => {
            if (material.type === "ShaderMaterial") {
                material.uniforms.winResolution.value = new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                ).multiplyScalar(Math.min(window.devicePixelRatio, 2));
            }
        });

        cylinder2.current.material.forEach((material) => {
            if (material.type === "ShaderMaterial") {
                material.uniforms.winResolution.value = new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                ).multiplyScalar(Math.min(window.devicePixelRatio, 2));
            }
        });

        torus.current.visible = false;
        box.current.visible = true;
        gl.setRenderTarget(renderTarget1);
        gl.render(scene, camera);

        torus.current.visible = true;
        box.current.visible = false;
        gl.setRenderTarget(renderTarget2);
        gl.render(scene, camera);

        gl.setRenderTarget(null);

        const newPosZ = Math.sin(clock.elapsedTime) * 3.5;
        box.current.position.z = newPosZ;
        torus.current.position.z = newPosZ;

        box.current.rotation.x = Math.cos(clock.elapsedTime / 2);
        box.current.rotation.y = Math.sin(clock.elapsedTime / 2);
        box.current.rotation.z = Math.sin(clock.elapsedTime / 2);

        torus.current.rotation.x = Math.cos(clock.elapsedTime / 2);
        torus.current.rotation.y = Math.sin(clock.elapsedTime / 2);
        torus.current.rotation.z = Math.sin(clock.elapsedTime / 2);
    });

    return (
        <>
            <Sky sunPosition={[10, 10, 0]} />
            <Environment files={Sunset} />
            <directionalLight args={[10, 10, 0]} intensity={1} />
            <ambientLight intensity={0.5} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={3} />
            <mesh
                ref={cylinder1}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, -4]}
            >
                <cylinderGeometry args={[3, 3, 8, 32]} />
                <shaderMaterial
                    key={uuidv4()}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        ...uniforms,
                        uTexture: {
                            value: renderTarget1.texture,
                        },
                    }}
                    attach="material-0"
                />
                <shaderMaterial
                    key={uuidv4()}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        ...uniforms,
                        uTexture: {
                            value: renderTarget1.texture,
                        },
                    }}
                    attach="material-1"
                />
                <meshStandardMaterial
                    attach="material-2"
                    color="green"
                    transparent
                    opacity={0}
                />
            </mesh>
            <mesh
                ref={cylinder2}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 4]}
            >
                <cylinderGeometry args={[3, 3, 8, 32]} />
                <shaderMaterial
                    key={uuidv4()}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        ...uniforms,
                        uTexture: {
                            value: renderTarget2.texture,
                        },
                    }}
                    attach="material-0"
                />
                <meshStandardMaterial
                    attach="material-1"
                    color="green"
                    transparent
                    opacity={0}
                />
                <shaderMaterial
                    key={uuidv4()}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        ...uniforms,
                        uTexture: {
                            value: renderTarget2.texture,
                        },
                    }}
                    attach="material-2"
                />
            </mesh>
            <mesh>
                <torusGeometry args={[3, 0.2, 16, 100]} />
                <meshStandardMaterial color="#F9F9F9" />
            </mesh>
            <mesh ref={torus} position={[0, 0, 0]}>
                <torusKnotGeometry args={[0.75, 0.3, 100, 16]} />
                <meshPhysicalMaterial
                    roughness={0}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    color="#73B9ED"
                />
            </mesh>
            <mesh ref={box} position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshPhysicalMaterial
                    roughness={0}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    color="#73B9ED"
                />
            </mesh>
        </>
    );
};

const App = () => {
    return <TransformPortal />;
};

export default App;
