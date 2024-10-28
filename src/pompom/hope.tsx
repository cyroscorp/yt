import { useEffect, useRef, useState } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showStarfield, setShowStarfield] = useState(true);
  let speed = 0.05;
  let stars: Star[] = [];

  class Star {
    x: number;
    y: number;
    px: number;
    py: number;
    z: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth - canvasWidth / 2;
      this.y = Math.random() * canvasHeight - canvasHeight / 2;
      this.px = 0;
      this.py = 0;
      this.z = Math.random() * 4;
    }

    update() {
      this.px = this.x;
      this.py = this.y;
      this.z += speed;
      this.x += this.x * (speed * 0.2) * this.z;
      this.y += this.y * (speed * 0.2) * this.z;

      if (
        this.x > canvasRef.current!.width / 2 + 50 ||
        this.x < -canvasRef.current!.width / 2 - 50 ||
        this.y > canvasRef.current!.height / 2 + 50 ||
        this.y < -canvasRef.current!.height / 2 - 50
      ) {
        this.x = Math.random() * canvasRef.current!.width - canvasRef.current!.width / 2;
        this.y = Math.random() * canvasRef.current!.height - canvasRef.current!.height / 2;
        this.px = this.x;
        this.py = this.y;
        this.z = 0;
      }
    }

    show(c: CanvasRenderingContext2D) {
      c.lineWidth = this.z;
      c.beginPath();
      c.moveTo(this.x, this.y);
      c.lineTo(this.px, this.py);
      c.stroke();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('wheel', (event) => {
      if (event.deltaY < 0) speed *= 1.1;
      else speed *= 0.9;
      if (speed < 0.01) speed = 0.01;
      else if (speed > 100) speed = 0.1;
    });

    for (let i = 0; i < 800; i++) stars.push(new Star(canvas.width, canvas.height));

    c.fillStyle = 'rgba(0, 0, 0, 0.4)';
    c.strokeStyle = 'rgb(255, 255, 255)';
    c.translate(canvas.width / 2, canvas.height / 2);

    const draw = () => {
      requestAnimationFrame(draw);
      c.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      for (let s of stars) {
        s.update();
        s.show(c);
      }
    };
    draw();

    const timer = setTimeout(() => {
      setShowStarfield(false); // Hide the starfield after 3 seconds
    }, 4000);

    return () => {
      clearTimeout(timer); // Cleanup the timer on unmount
      window.removeEventListener('wheel', () => {});
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full transition-opacity duration-1000 ${showStarfield ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Starfield;
