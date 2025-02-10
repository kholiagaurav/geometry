import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { Line, Html } from '@react-three/drei';

const LineThreeComponent = ({ isDrawingEnabled, lines, setLines, is3D, zoom }) => {
  const [currentLine, setCurrentLine] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const planeRef = useRef();

  const getExactPoint = (point) => [
    Math.round(point.x * 100) / 100,
    0.1,
    Math.round(point.z * 100) / 100,
  ];

  const calculateDistance = (start, end) => {
    if (!start || !end) return '0.00';
    const dx = end[0] - start[0];
    const dz = end[2] - start[2];
    return Math.sqrt(dx * dx + dz * dz).toFixed(2);
  };

  const getMidpoint = (start, end) => {
    if (!start || !end) return [0, 0.1, 0];
    return [(start[0] + end[0]) / 2, 0.1, (start[2] + end[2]) / 2];
  };

  const isPerfectlyStraight = (start, end) => {
    const dx = Math.abs(end[0] - start[0]);
    const dz = Math.abs(end[2] - start[2]);
    return dx === 0 || dz === 0;
  };

  const handlePlanePointerDown = (e) => {
    if (!isDrawingEnabled) return;
    e.stopPropagation();
    setIsDragging(true);

    const point = getExactPoint(e.point);
    setCurrentLine({ start: point, end: point });
  };

  const handlePlanePointerMove = (e) => {
    if (!isDragging || !currentLine) return;
    e.stopPropagation();

    const point = getExactPoint(e.point);
    setCurrentLine((prev) => ({ ...prev, end: point }));
  };

  const handlePlanePointerUp = () => {
    if (currentLine?.start && currentLine?.end) {
      setLines((prev) => [...prev, { ...currentLine }]);
    }

    setIsDragging(false);
    setCurrentLine(null);
  };

  const getCurrentLineColor = () => {
    if (!currentLine) return 'black';
    return isDragging
      ? isPerfectlyStraight(currentLine.start, currentLine.end)
        ? 'green'
        : 'red'
      : 'black';
  };

  const LeftRuler = ({ zoom }) => {
    const rulerHeight = 1000;
    const step = 5;
  
    const marks = [];
    for (let i = -rulerHeight / 2; i <= rulerHeight / 2; i += step) {
      if (i === 0) continue;
  
      marks.push(
        <group key={`mark-${i}`}>
          <mesh position={[-0.5, 0.1, i]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.02]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <Html position={[-1, 0.1, i]}>
            <div style={{
              color: 'black',
              fontSize: '10px',
              background: 'white',
              padding: '2px',
              borderRadius: '2px',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}>
              {-i} m
            </div>
          </Html>
        </group>
      );
    }
  
    return <group>{marks}</group>;
  };

  const BottomRuler = ({ zoom }) => {
    const rulerWidth = 1000;
    const step = 5;
  
    const marks = [];
    for (let i = -rulerWidth / 2; i <= rulerWidth / 2; i += step) {
      if (i === 0) continue;
  
      marks.push(
        <group key={`mark-x-${i}`}>
          <mesh position={[i, 0.1, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.02, 0.3]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <Html position={[i, 0.1, 1]}>
            <div style={{
              color: 'black',
              fontSize: '10px',
              background: 'white',
              padding: '2px',
              borderRadius: '2px',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}>
              {i} m
            </div>
          </Html>
        </group>
      );
    }
  
    return <group>{marks}</group>;
  };

  return (
    <group>
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePlanePointerDown}
        onPointerMove={handlePlanePointerMove}
        onPointerUp={handlePlanePointerUp}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {lines.map((line, index) => (
        <group key={index}>
          <Line
            points={[new THREE.Vector3(...line.start), new THREE.Vector3(...line.end)]}
            color="black"
            lineWidth={2}
          />
          <Html position={getMidpoint(line.start, line.end)}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, -100%)',
            }}>
              {calculateDistance(line.start, line.end)} m
            </div>
          </Html>
        </group>
      ))}

      {currentLine?.start && currentLine?.end && (
        <group>
          <Line
            points={[
              new THREE.Vector3(...currentLine.start),
              new THREE.Vector3(...currentLine.end),
            ]}
            color={getCurrentLineColor()}
            lineWidth={2}
          />
          <Html position={getMidpoint(currentLine.start, currentLine.end)}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, -100%)',
            }}>
              {calculateDistance(currentLine.start, currentLine.end)} m
            </div>
          </Html>
        </group>
      )}

      {!is3D && (
        <>
          <LeftRuler zoom={zoom} />
          <BottomRuler zoom={zoom} />
        </>
      )}
    </group>
  );
};

export default LineThreeComponent;