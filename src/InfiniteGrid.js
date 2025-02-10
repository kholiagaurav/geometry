import React, { useEffect, useRef, useState } from 'react';

const InfiniteGrid = () => {
  const canvasRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const baseGridSize = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = baseGridSize * zoom;
      
      // Draw grid
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      const startX = offset.x % gridSize;
      const startY = offset.y % gridSize;
      
      // Vertical lines
      for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Measurements
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      
      for (let x = startX; x < canvas.width; x += gridSize) {
        const measurement = Math.round((x - offset.x) / gridSize);
        ctx.fillText(measurement.toString(), x + 2, 15);
      }
      
      for (let y = startY; y < canvas.height; y += gridSize) {
        const measurement = Math.round((y - offset.y) / gridSize);
        ctx.fillText(measurement.toString(), 5, y + 15);
      }

      // Draw all saved lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(
          line.start.x * zoom + offset.x,
          line.start.y * zoom + offset.y
        );
        ctx.lineTo(
          line.end.x * zoom + offset.x,
          line.end.y * zoom + offset.y
        );
        ctx.stroke();
      });

      // Draw current line if drawing
      if (currentLine) {
        ctx.beginPath();
        ctx.moveTo(
          currentLine.start.x * zoom + offset.x,
          currentLine.start.y * zoom + offset.y
        );
        ctx.lineTo(
          currentLine.end.x * zoom + offset.x,
          currentLine.end.y * zoom + offset.y
        );
        ctx.stroke();
      }

      // Draw UI elements
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.fillText(`Zoom: ${Math.round(zoom * 100)}%`, 10, canvas.height - 20);
      ctx.fillText(`Mode: ${drawMode ? 'Draw' : 'Pan'}`, 10, canvas.height - 40);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const render = () => {
      drawGrid();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [offset, zoom, lines, currentLine, drawMode]);

  const getCanvasCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom
    };
  };

  const handleMouseDown = (e) => {
    if (drawMode) {
      setIsDrawing(true);
      const coords = getCanvasCoordinates(e);
      setCurrentLine({
        start: coords,
        end: coords
      });
    } else {
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && drawMode) {
      const coords = getCanvasCoordinates(e);
      setCurrentLine(prev => ({
        ...prev,
        end: coords
      }));
    } else if (isDragging && !drawMode) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentLine) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
    setIsDrawing(false);
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);
    const scaleFactor = 1 - newZoom / zoom;
    
    setOffset(prev => ({
      x: prev.x + (mouseX - prev.x) * scaleFactor,
      y: prev.y + (mouseY - prev.y) * scaleFactor
    }));
    
    setZoom(newZoom);
  };

  const toggleDrawMode = () => {
    setDrawMode(!drawMode);
  };

  const clearLines = () => {
    setLines([]);
    setCurrentLine(null);
  };

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="w-full h-screen bg-white cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      
    </div>
  );
};

export default InfiniteGrid;