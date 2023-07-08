import { Grid } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial } from "three";

import fragmentShader from "../shaders/bg_frag_shader.glsl";
import vertexShader from "../shaders/bg_vert_shader.glsl";

export function BackgroundContent() {

    return (
        <Canvas>
            <Grid args={[15, 15]} />
            {/* <OrbitControls/> */}
            <Anim />
        </Canvas>
    )
}

export function Anim() {
    const meshRef = useRef(null!);
    const { camera } = useThree();

    camera.position.set(0, 0, 2.5);

    return (
        <>
            <Scene meshRef={meshRef} />
        </>
    )
}

export function Scene({ meshRef }: { meshRef: any }) {

    const { size } = useThree();
    const shaderRef = useRef<ShaderMaterial>(null!);

    useFrame(({ clock }) => {
        shaderRef.current.uniforms.u_time = {
            value: clock.getElapsedTime() * 0.05
        }
    });

    return (
        <>
            <mesh ref={meshRef}>
                <planeGeometry args={[10, 10, 1500, 1500]} />
                <shaderMaterial
                    ref={shaderRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        u_resolution: {
                            value: {
                                x: size.width,
                                y: size.height
                            }
                        },
                        u_time: { value: 1.0 }
                    }}
                />
            </mesh>
        </>
    );
}