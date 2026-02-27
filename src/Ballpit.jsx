import Matter from "matter-js";
import { randomInt } from "mathjs";
import { useRef, useEffect } from "react";

export default function Ballpit({ count }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;

        // setup

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;
        
        const engine = Engine.create({
            gravity: {
                scale: 0.0012
            }
        });

        const render = Render.create({ canvas: canvas, engine: engine, options: {
            wireframes: false,
            background: "transparent"
        }});

        const runner = Runner.create();

        Composite.add(engine.world, MouseConstraint.create(engine, {
            mouse: Mouse.create(render.canvas),
            constraint: {
                stiffness: 0.1,
                render: { visible: false }
            }
        }));

        // borders

        const width = window.innerWidth;
        const height = window.innerHeight;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const borderThickness = 1000;
        const borderHeight = 999999;
        const halfBorderThickness = borderThickness / 2;

        const borderProperties = {
            isStatic: true,
            render: {
                visible: false
            }
        }

        Composite.add(engine.world, [
            Bodies.rectangle(halfWidth, height + halfBorderThickness, width, borderThickness, borderProperties), // ground
            Bodies.rectangle(-halfBorderThickness, halfHeight, borderThickness, borderHeight, borderProperties), // left
            Bodies.rectangle(width + halfBorderThickness, halfHeight, borderThickness, borderHeight, borderProperties) // right
        ]);

        // ball pit

        const orbs = [
            "black",
            "blue",
            "green",
            "greendash",
            "purple",
            "purpledash",
            "red",
            "spider",   
            "teleport",
            "toggle",
            "yellow"
        ];

        function orb() {
            const selectedOrb = orbs[randomInt(0, orbs.length - 1)];

            const radius = randomInt(40, 60);
            const diameter = radius * 2;
            const scale = diameter / 120; // 120x120 images

            const x = randomInt(0 + radius, window.innerWidth - radius);
            const y = -500;

            const options = {
                restitution: 0.95, // bouncy
                render: {
                    sprite: {
                        texture: `/${selectedOrb}.png`,
                        xScale: scale,
                        yScale: scale
                    }
                }
            }

            let body;

            if (selectedOrb !== "toggle") {
                body = Bodies.circle(x, y, radius, options);
            } else {
                body = Bodies.rectangle(x, y, diameter, diameter, options);
            }

            Body.setVelocity(body, { x: randomInt(-10, 10), y: 0 });
            Body.setAngle(body, randomInt(-180, 180) * (Math.PI / 180));

            Composite.add(engine.world, body);
        }

        for (let i = 0; i < count; i++) {
            orb();
        }

        // render

        Render.run(render);
        Runner.run(runner, engine);

        function resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            render.canvas.width = width;
            render.canvas.height = height;
            render.options.width = width;
            render.options.height = height;
        }
        
        resize();

        window.addEventListener("resize", resize);
        
        return () => {
            Render.stop(render);
            Runner.stop(runner);

            window.removeEventListener("resize", resize);
        }
    }, []);

    return <canvas ref={canvasRef}/>
}
