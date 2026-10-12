
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type MarkerStatus = "active" | "incomplete" | "inactive";

interface GlobeMarker {
    id: string;
    latitude: number;
    longitude: number;
    status: MarkerStatus;
}

// Coordenadas e cores meramente ilustrativas.
// Substitua pelas localizações reais recebidas da API.
const demoMarkers: GlobeMarker[] = [
    {
        id: "marker-1",
        latitude: 40.7,
        longitude: -74,
        status: "active",
    },
    {
        id: "marker-2",
        latitude: 51.5,
        longitude: -0.1,
        status: "incomplete",
    },
    {
        id: "marker-3",
        latitude: -23.5,
        longitude: -46.6,
        status: "inactive",
    },
    {
        id: "marker-4",
        latitude: 35.7,
        longitude: 139.7,
        status: "active",
    },
];

const markerColors: Record<MarkerStatus, string> = {
    active: "#91bd79",
    incomplete: "#e0d344",
    inactive: "#df7779",
};

function createEarthTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Não foi possível criar a textura do globo.");
    }

    context.fillStyle = "#eee5d5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Contornos simplificados em coordenadas normalizadas.
    // Cada par representa longitude e latitude aproximadas.
    const continents: [number, number][][] = [
        [
            [-168, 70], [-140, 72], [-115, 58], [-100, 50],
            [-83, 50], [-60, 45], [-80, 10], [-98, 8],
            [-112, 28], [-130, 48], [-155, 55],
        ],
        [
            [-81, 12], [-60, 8], [-35, -8], [-48, -30],
            [-70, -56], [-78, -25], [-83, -5],
        ],
        [
            [-10, 72], [30, 70], [65, 55], [100, 60],
            [145, 48], [165, 60], [178, 45], [150, 10],
            [120, -5], [105, 10], [75, 5], [50, 30],
            [30, 35], [15, 55],
        ],
        [
            [-18, 35], [10, 37], [38, 20], [48, -5],
            [32, -35], [18, -35], [0, -20], [-10, 5],
        ],
        [
            [112, -12], [145, -10], [154, -25],
            [135, -42], [115, -32],
        ],
        [
            [-52, 80], [-28, 75], [-20, 60],
            [-42, 58], [-58, 68],
        ],
    ];

    const toCanvas = (longitude: number, latitude: number) => ({
        x: ((longitude + 180) / 360) * canvas.width,
        y: ((90 - latitude) / 180) * canvas.height,
    });

    context.fillStyle = "#d1cbbb";

    continents.forEach((continent) => {
        context.beginPath();

        continent.forEach(([longitude, latitude], index) => {
            const point = toCanvas(longitude, latitude);

            if (index === 0) {
                context.moveTo(point.x, point.y);
            } else {
                context.lineTo(point.x, point.y);
            }
        });

        context.closePath();
        context.fill();
    });

    // Pontilhado aplicado somente sobre os continentes.
    const image = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const landMask = new Uint8Array(canvas.width * canvas.height);

    for (let i = 0; i < landMask.length; i++) {
        const pixel = i * 4;

        if (
            image.data[pixel + 3] > 0 &&
            image.data[pixel] < 220
        ) {
            landMask[i] = 1;
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#eee5d5";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Recria a máscara dos continentes para o padrão de pontos.
    context.fillStyle = "#d1cbbb";

    continents.forEach((continent) => {
        context.beginPath();

        continent.forEach(([longitude, latitude], index) => {
            const point = toCanvas(longitude, latitude);

            if (index === 0) {
                context.moveTo(point.x, point.y);
            } else {
                context.lineTo(point.x, point.y);
            }
        });

        context.closePath();
        context.fill();
    });

    // Uma grade fina de pontos com transparência suave.
    context.fillStyle = "#4b473e";

    for (let y = 3; y < canvas.height; y += 5) {
        for (let x = 3; x < canvas.width; x += 5) {
            const pixel = (y * canvas.width + x) * 4;
            const insideLand =
                image.data[pixel] < 220 &&
                image.data[pixel + 3] > 0;

            if (insideLand) {
                context.beginPath();
                context.arc(x, y, 1, 0, Math.PI * 2);
                context.fill();
            }
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;

    return texture;
}

function latitudeLongitudeToVector(
    latitude: number,
    longitude: number,
    radius: number
): THREE.Vector3 {
    const phi = THREE.MathUtils.degToRad(90 - latitude);
    const theta = THREE.MathUtils.degToRad(longitude + 180);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function EarthMarkers() {
    return (
        <group>
            {demoMarkers.map((marker) => {
                const position = latitudeLongitudeToVector(
                    marker.latitude,
                    marker.longitude,
                    1.012
                );

                return (
                    <group key={marker.id} position={position}>
                        <mesh>
                            <sphereGeometry args={[0.027, 16, 16]} />
                            <meshBasicMaterial
                                color={markerColors[marker.status]}
                            />
                        </mesh>

                        <mesh>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshBasicMaterial
                                color={markerColors[marker.status]}
                                transparent
                                opacity={0.18}
                                depthWrite={false}
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

function Earth() {
    const earthTexture = useMemo(() => createEarthTexture(), []);

    return (
        <group rotation={[0, -0.45, 0.08]}>
            <mesh>
                <sphereGeometry args={[1, 96, 96]} />

                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.95}
                    metalness={0}
                />
            </mesh>

            <EarthMarkers />

            {/* Halo discreto ao redor do planeta */}
            <mesh scale={1.035}>
                <sphereGeometry args={[1, 64, 64]} />

                <meshBasicMaterial
                    color="#b6a99a"
                    transparent
                    opacity={0.09}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

export default function InteractiveGlobe() {
    return (
        <Canvas
            camera={{
                position: [0, 0, 3.2],
                fov: 38,
            }}
            dpr={[1, 1.75]}
            gl={{
                antialias: true,
                alpha: true,
            }}
            fallback={
                <div className="globe-fallback">
                    Seu navegador não conseguiu renderizar o globo 3D.
                </div>
            }
        >
            <ambientLight intensity={2.1} />

            <directionalLight
                position={[-3, 4, 5]}
                intensity={1.1}
            />

            <Suspense fallback={null}>
                <Earth />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableRotate
                enableZoom
                minDistance={2.2}
                maxDistance={5}
                rotateSpeed={0.55}
                zoomSpeed={0.65}
                minPolarAngle={0.15}
                maxPolarAngle={Math.PI - 0.15}
            />
        </Canvas>
    );
}
