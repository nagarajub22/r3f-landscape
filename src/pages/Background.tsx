import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Outline, Sepia } from "@react-three/postprocessing";
import { BlendFunction, KernelSize, Resolution } from 'postprocessing';
import { useRef } from "react";
import { ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "./common/BackgroundShaderMaterial";

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
            <EffectComposer>
                <Sepia 
                    intensity={1.0} // sepia intensity
                    blendFunction={BlendFunction.HUE} 
                />
            </EffectComposer> 
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