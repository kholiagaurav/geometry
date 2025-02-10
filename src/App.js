// import React, { useState, useEffect } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, Box, Sphere, Cone, Cylinder, Line, Text, Html } from "@react-three/drei";
// import { LuMousePointer2, LuPencilLine } from "react-icons/lu";
// import { FaEye, FaEyeSlash, FaTh, FaCube, FaDrawPolygon, FaEraser, FaFileImport, FaFileExport } from "react-icons/fa";
// import { BiSolidMessageAltDots, BiHelpCircle } from "react-icons/bi";
// import { CgProfile } from "react-icons/cg";
// import { Eye, Maximize, Minus, Plus } from 'lucide-react';
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { FaFileLines } from "react-icons/fa6";
// import * as THREE from 'three';
// import LineThreeComponent from './LineComponent';
// import InitialPopup from './initial'
// import { FaArrowUp, FaArrowDown } from "react-icons/fa";
// import RulerScale from "./RulerScale";


// const METER_TO_PIXEL = 3779.53;


// const toPixels = (valueInMeters) => valueInMeters * METER_TO_PIXEL;
// const toMeters = (valueInPixels) => valueInPixels / METER_TO_PIXEL;
// const snapToGrid = (value, gridSize = 1) => Math.round(value / gridSize) * gridSize;
// function Fixed2DView({ is3D, zoom }) {
//   const { camera } = useThree();
//   useEffect(() => {
//     if (is3D) {
//       camera.position.set(0, 10, 10); // 3D Perspective View
//       camera.lookAt(0, 0, 0);
//     } else {
//       camera.position.set(0, 20, 0); // Top-down 2D View
//       camera.lookAt(0, 0, 0);
//     }
//   }, [is3D, camera]);

//   useEffect(() => {
//     camera.zoom = zoom;
//     camera.updateProjectionMatrix();
//   }, [zoom, camera]);

//   return null;
// }
// function Grid({ gridSize, onMouseDown, onMouseMove, onMouseUp, is3D, selectedTool }) {
//   const handleMouseEvent = (event, handler) => {
//     if (is3D) {
//       event.stopPropagation();
//     } else {
//       handler(event);
//     }
//   };

//   // Create multiple grid layers for infinite effect
//   const gridLayers = [];
//   const numLayers = 10; // Increased number of layers for more infinite feel
//   const layerSize = 2000; // Larger layer size
//   const mainGridColor = "#e0e0e0"; // Light gray for main grid
//   const subGridColor = "#f0f0f0"; // Lighter gray for sub grid

//   // Create primary grid (larger squares)
//   for (let i = -numLayers; i <= numLayers; i++) {
//     for (let j = -numLayers; j <= numLayers; j++) {
//       // Main grid (darker lines)
//       gridLayers.push(
//         <gridHelper
//           key={`main-${i}-${j}`}
//           args={[layerSize, layerSize/gridSize, mainGridColor, mainGridColor]}
//           position={[i * layerSize, 0, j * layerSize]}
//         />
//       );

//       // Sub grid (lighter lines)
//       gridLayers.push(
//         <gridHelper
//           key={`sub-${i}-${j}`}
//           args={[layerSize, layerSize/(gridSize/10), subGridColor, subGridColor]}
//           position={[i * layerSize, 0, j * layerSize]}
//         />
//       );
//     }
//   }

//   return (
//     <group
//       onPointerDown={(event) => {
//         // Snap to grid on pointer down
//         if (event.point) {
//           event.point.x = Math.round(event.point.x / gridSize) * gridSize;
//           event.point.z = Math.round(event.point.z / gridSize) * gridSize;
//         }
//         handleMouseEvent(event, onMouseDown);
//       }}
//       onPointerMove={(event) => {
//         // Snap to grid on pointer move
//         if (event.point) {
//           event.point.x = Math.round(event.point.x / gridSize) * gridSize;
//           event.point.z = Math.round(event.point.z / gridSize) * gridSize;
//         }
//         handleMouseEvent(event, onMouseMove);
//       }}
//       onPointerUp={(event) => {
//         // Snap to grid on pointer up
//         if (event.point) {
//           event.point.x = Math.round(event.point.x / gridSize) * gridSize;
//           event.point.z = Math.round(event.point.z / gridSize) * gridSize;
//         }
//         handleMouseEvent(event, onMouseUp);
//       }}
//     >
//       <mesh 
//         position={[0, -0.1, 0]} 
//         rotation={[-Math.PI / 2, 0, 0]}
//         receiveShadow
//       >
//         <planeGeometry args={[layerSize * (numLayers * 2), layerSize * (numLayers * 2)]} />
//         <meshBasicMaterial color="#ffffff" />
//       </mesh>
//       {gridLayers}
//     </group>
//   );
// }

// const MeasurementLabel = ({ position, value, label }) => (
//   <Html position={position}>
//     <div style={{
//       display: 'inline-block',
//       padding: '2px 4px',
//       fontSize: '10px',
//       color: 'white',
//       backgroundColor: 'rgba(0, 0, 0, 0.75)',
//       borderRadius: '4px',
//       whiteSpace: 'nowrap'
//     }}>
//       {label}: {value.toFixed(2)} m
//     </div>
//   </Html>
// );


// const GeometryRenderer = ({ geometries, updateGeometry, is3D, moveGeometry }) => {
//   const [geometryStates, setGeometryStates] = useState(
//     geometries.map(() => false)
//   );

//   const handleGeometryClick = (index) => {
//     const newGeometryStates = [...geometryStates];
//     newGeometryStates[index] = !newGeometryStates[index];
//     setGeometryStates(newGeometryStates);
//     updateGeometry(index);
//   };

//   return geometries.map((geometry, index) => {
//     const { type, position, width, depth, height, radius, startAngle, endAngle, showDimensions, isTemporary, isExtruded } =
//       geometry;
//     const isGeometryClicked = geometryStates[index];

//     const commonProps = {
//       position,
//       onPointerDown: (e) => {
//         e.stopPropagation();
//         handleGeometryClick(index);
//         moveGeometry(index, true);
//       },
//     };
   
//     const renderMeasurements = () => {
//       if (!is3D && (!isGeometryClicked && !isTemporary)) return null; // Show during dragging or when selected

//       const measurements = [];
//       const offset = 0.5;

//       if (type === "Rect") {
//         // Display width and depth
//         measurements.push(
//           <MeasurementLabel
//             key={`width-${index}`}
//             position={[position[0] + width / 2, 0.3, position[2]]}
//             value={width}
//             label="W"
//           />
//         );
//         measurements.push(
//           <MeasurementLabel
//             key={`depth-${index}`}
//             position={[position[0], 0.3, position[2] + depth / 2]}
//             value={depth}
//             label="L"
//           />
//         );

//         // Display height only in 3D view and when geometry is extruded
//         if (is3D && isExtruded) {
//           measurements.push(
//             <MeasurementLabel
//               key={`height-${index}`}
//               position={[position[0] + width / 2 + offset, height / 2, position[2]]}
//               value={height}
//               label="H"
//             />
//           );
//         }
//       } else if (type === "Sphere" || type === "Circle") {
//         // Display diameter
//         measurements.push(
//           <MeasurementLabel
//             key={`diameter-${index}`}
//             position={[position[0] + radius + offset, 0.3, position[2]]}
//             value={radius * 2}
//             label="⌀"
//           />
//         );
//       }  else if (type === "Oval") {
//         // Display width and depth for oval
//         measurements.push(
//           <MeasurementLabel
//             key={`width-${index}`}
//             position={[position[0] + width / 2, 0.3, position[2]]}
//             value={width}
//             label="W"
//           />
//         );
//         measurements.push(
//           <MeasurementLabel
//             key={`depth-${index}`}
//             position={[position[0], 0.3, position[2] + depth / 2]}
//             value={depth}
//             label="L"
//           />
//         );

//         // Display height only in 3D view and when geometry is extruded
//         if (is3D && isExtruded) {
//           measurements.push(
//             <MeasurementLabel
//               key={`height-${index}`}
//               position={[position[0] + width / 2 + offset, height / 2, position[2]]}
//               value={height}
//               label="H"
//             />
//           );
//         }
//       }

//       return measurements;
//     };
   
//     // Update the Arc rendering in GeometryRenderer
  
//     const createRegularPolygon = (sides, radius) => {
//       const points = [];
//       const startAngle = -Math.PI/2;
      
//       for (let i = 0; i < sides; i++) {
//         const angle = startAngle + (i * 2 * Math.PI) / sides;
//         points.push(
//           new THREE.Vector2(
//             radius * Math.cos(angle),
//             radius * Math.sin(angle)
//           )
//         );
//       }
//       return points;
//     };
    
//     const renderPolygon = (type, position, radius, height, is3D, commonProps, lineMaterialProps, isTemporary) => {
//       const sides = type === "Pentagon" ? 5 : 6;
//       const points = createRegularPolygon(sides, radius);
//       const shape = new THREE.Shape();
      
//       // Create the shape path
//       shape.moveTo(points[0].x, points[0].y);
//       for (let i = 1; i < points.length; i++) {
//         shape.lineTo(points[i].x, points[i].y);
//       }
//       shape.closePath();
    
//       // Calculate side length
//       const sideLength = 2 * radius * Math.sin(Math.PI / sides);
    
//       const renderMeasurements = () => {
//         const measurements = [];
        
//         // Create measurements for each side
//         for (let i = 0; i < points.length; i++) {
//           const currentPoint = points[i];
//           const nextPoint = points[(i + 1) % points.length];
          
//           // Calculate midpoint of the side for label placement
//           const midX = (currentPoint.x + nextPoint.x) / 2;
//           const midY = (currentPoint.y + nextPoint.y) / 2;
          
//           measurements.push(
//             <Html
//               key={`side-${i}`}
//               position={[
//                 position[0] + midX,
//                 0.3,
//                 position[2] + midY
//               ]}
//             >
//               <div style={{
//                 background: 'rgba(0, 0, 0, 0.75)',
//                 color: 'white',
//                 padding: '2px 4px',
//                 borderRadius: '4px',
//                 fontSize: '10px',
//                 whiteSpace: 'nowrap',
//                 userSelect: 'none'
//               }}>
//                 {sideLength.toFixed(2)}m
//               </div>
//             </Html>
//           );
//         }
        
//         return measurements;
//       };
    
//       if (is3D) {
//         return (
//           <group>
//             <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
//               <extrudeGeometry 
//                 args={[shape, { 
//                   depth: height, 
//                   bevelEnabled: false 
//                 }]} 
//               />
//               <meshStandardMaterial color="orange" />
//             </mesh>
//             {renderMeasurements()}
//           </group>
//         );
//       } else {
//         return (
//           <group>
//             <mesh
//               {...commonProps}
//               rotation={[-Math.PI / 2, 0, 0]}
//               position={[position[0], 0.1, position[2]]}
//             >
//               <shapeGeometry args={[shape]} />
//               <meshBasicMaterial transparent opacity={0} />
//             </mesh>
    
//             <lineSegments 
//               position={[position[0], 0.1, position[2]]} 
//               rotation={[-Math.PI / 2, 0, 0]}
//             >
//               <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
//               <lineBasicMaterial {...lineMaterialProps} />
//             </lineSegments>
//             {renderMeasurements()}
//           </group>
//         );
//       }
//     };
//     const ArcComponent = ({ position, radius, startAngle, endAngle, isTemporary }) => {
//       // Create the main arc curve
//       const curve = new THREE.ArcCurve(
//         0, 0,           // center
//         radius,         // radius
//         startAngle,     // start angle
//         endAngle,       // end angle
//         false           // counterclockwise
//       );
      
//       // Get points along the curve for the arc
//       const points = curve.getPoints(50);
//       const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
    
//       // Create start and end radius lines
//       const startPoint = new THREE.Vector3(
//         radius * Math.cos(startAngle),
//         0,
//         radius * Math.sin(startAngle)
//       );
//       const endPoint = new THREE.Vector3(
//         radius * Math.cos(endAngle),
//         0,
//         radius * Math.sin(endAngle)
//       );
    
//       // Calculate angle in degrees for display
//       const angleDegrees = ((endAngle - startAngle) * 180 / Math.PI).toFixed(1);
//       const arcLength = (radius * Math.abs(endAngle - startAngle)).toFixed(2);
      
//       // Calculate midpoint for angle label
//       const midAngle = (startAngle + endAngle) / 2;
//       const labelRadius = radius * 0.7; // Position label at 70% of radius
//       const labelPosition = [
//         labelRadius * Math.cos(midAngle),
//         0.1,
//         labelRadius * Math.sin(midAngle)
//       ];
    
//       return (
//         <group position={position}>
//           {/* Main arc */}
//           <line geometry={arcGeometry}>
//             <lineBasicMaterial color="#2196F3" linewidth={3} />
//           </line>
    
//           {/* Start radius line */}
//           <line>
//             <bufferGeometry
//               attach="geometry"
//               {...new THREE.BufferGeometry().setFromPoints([
//                 new THREE.Vector3(0, 0, 0),
//                 startPoint
//               ])}
//             />
//             <lineDashedMaterial
//               color="#666666"
//               dashSize={0.5}
//               gapSize={0.3}
//               linewidth={2}
//             />
//           </line>
    
//           {/* End radius line */}
//           <line>
//             <bufferGeometry
//               attach="geometry"
//               {...new THREE.BufferGeometry().setFromPoints([
//                 new THREE.Vector3(0, 0, 0),
//                 endPoint
//               ])}
//             />
//             <lineDashedMaterial
//               color="#666666"
//               dashSize={0.5}
//               gapSize={0.3}
//               linewidth={2}
//             />
//           </line>
    
//           {/* Measurements */}
//           {!isTemporary && (
//             <>
//               {/* Angle measurement */}
//               <Html position={labelPosition}>
//                 <div style={{
//                   background: 'rgba(0, 0, 0, 0.7)',
//                   color: 'white',
//                   padding: '2px 6px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   whiteSpace: 'nowrap',
//                   userSelect: 'none'
//                 }}>
//                   {angleDegrees}°
//                 </div>
//               </Html>
    
//               {/* Radius measurement */}
//               <Html position={[radius/2, 0.1, 0]}>
//                 <div style={{
//                   background: 'rgba(0, 0, 0, 0.7)',
//                   color: 'white',
//                   padding: '2px 6px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   whiteSpace: 'nowrap',
//                   userSelect: 'none'
//                 }}>
//                   R: {radius.toFixed(2)}m
//                 </div>
//               </Html>
    
//               {/* Arc length measurement */}
//               <Html position={[
//                 radius * 1.2 * Math.cos(midAngle),
//                 0.1,
//                 radius * 1.2 * Math.sin(midAngle)
//               ]}>
//                 <div style={{
//                   background: 'rgba(0, 0, 0, 0.7)',
//                   color: 'white',
//                   padding: '2px 6px',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   whiteSpace: 'nowrap',
//                   userSelect: 'none'
//                 }}>
//                   Length: {arcLength}m
//                 </div>
//               </Html>
//             </>
//           )}
//         </group>
//       );
//     };
//     const lineMaterialProps = {
//       color: "blue",
//       linewidth: 1000, // Increase stroke width
//     };
//     // Box Geometry Rendering
//     if (type === "Rect") {
//       if (is3D) {
//         return (
//           <group key={index}>
//             <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
//               <boxGeometry args={[width, isExtruded ? height : 0, depth]} />
//               <meshStandardMaterial color="orange" />
//             </mesh>
//             {renderMeasurements()}
//           </group>
//         );
//       } else {
//         return (
//           <group key={index}>
//             {/* Invisible Mesh (for Click Events) */}
//             <mesh
//               {...commonProps}
//               rotation={[-Math.PI / 2, 0, 0]}
//               position={[position[0], 0.1, position[2]]}
//             >
//               <planeGeometry args={[width, depth]} />
//               <meshBasicMaterial transparent opacity={0} /> {/* Invisible */}
//             </mesh>

//             {/* Outline (Without Diagonal) */}
//             <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
//               <edgesGeometry args={[new THREE.PlaneGeometry(width, depth)]} />
//               <lineBasicMaterial {...lineMaterialProps} />
//             </lineSegments>
//             {renderMeasurements()}
//           </group>
//         );
//       }
//     }
   
//     else if (type === "Circle") {
//       if (is3D) {
//         return (
//           <group key={index}>
//             <mesh {...commonProps} rotation={[-Math.PI / 2, 0, 0]} position={[position[0], height / 2, position[2]]}>
//               <circleGeometry args={[radius, 32]} />
//               <meshStandardMaterial color="blue" />
//             </mesh>
//             {renderMeasurements()}
//           </group>
//         );
//       } else {
//         return (
//           <group key={index}>
//             {/* Invisible Mesh (for Click Events) */}
//             <mesh
//               {...commonProps}
//               rotation={[-Math.PI / 2, 0, 0]} // Flat alignment
//               position={[position[0], 0.1, position[2]]} // Slightly above ground
//             >
//               <circleGeometry args={[radius, 32]} />
//               <meshBasicMaterial transparent opacity={0} /> {/* Invisible */}
//             </mesh>

//             {/* Outline (Without Diagonal) */}
//             <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
//               <edgesGeometry args={[new THREE.CircleGeometry(radius, 32)]} />
//               <lineBasicMaterial color="green" />
//             </lineSegments>

//             {renderMeasurements()}
//           </group>
//         );
//       }
//     }
//     else if (type === "Oval") {
//       const ovalShape = new THREE.Shape();
//       const ovalWidth = width / 2;   // Half of the width
//       const ovalHeight = depth / 2;  // Half of the depth

//       // Draw an ellipse using `moveTo` and `absellipse`
//       ovalShape.moveTo(0, ovalHeight);
//       ovalShape.absellipse(0, 0, ovalWidth, ovalHeight, 0, Math.PI * 2, false, 0);

//       if (is3D) {
//         return (
//           <group key={index}>
//             <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
//               <extrudeGeometry args={[ovalShape, { depth: height, bevelEnabled: false }]} />
//               <meshStandardMaterial color="purple" />
//             </mesh>
//             {renderMeasurements()} {/* Using your existing measurement rendering */}
//           </group>
//         );
//       } else {
//         return (
//           <group key={index}>
//             {/* Invisible Mesh for Click Events */}
//             <mesh
//               {...commonProps}
//               rotation={[-Math.PI / 2, 0, 0]}
//               position={[position[0], 0.1, position[2]]}
//             >
//               <shapeGeometry args={[ovalShape]} />
//               <meshBasicMaterial transparent opacity={0} />
//             </mesh>

//             {/* Outline */}
//             <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
//               <edgesGeometry args={[new THREE.ShapeGeometry(ovalShape)]} />
//               <lineBasicMaterial color="purple" />
//             </lineSegments>

//             {renderMeasurements()} {/* Using your existing measurement rendering */}
//           </group>
//         );
//       }
//     }
//     else if (type === "Path") {
//       const path = new THREE.CurvePath();
//       const points = [
//         new THREE.Vector2(-width/2, 0),
//         new THREE.Vector2(0, depth),
//         new THREE.Vector2(width/2, 0)
//       ];
      
//       // Create a quadratic bezier curve
//       const curve = new THREE.QuadraticBezierCurve(
//         points[0],
//         points[1],
//         points[2]
//       );
      
//       path.add(curve);
//       const curvePoints = curve.getPoints(50);
//       const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    
//       if (is3D) {
//         // For 3D view, create an extruded geometry
//         const shape = new THREE.Shape();
//         shape.moveTo(points[0].x, points[0].y);
//         shape.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    
//         return (
//           <group key={index}>
//             <mesh {...commonProps} position={[position[0], height/2, position[2]]}>
//               <extrudeGeometry 
//                 args={[shape, { 
//                   depth: height, 
//                   bevelEnabled: false,
//                   steps: 50
//                 }]} 
//               />
//               <meshStandardMaterial color="blue" />
//             </mesh>
//             {renderMeasurements()}
//           </group>
//         );
//       } else {
//         // For 2D view, render as a line
//         return (
//           <group key={index}>
//             {/* Invisible mesh for click events */}
//             <mesh
//               {...commonProps}
//               position={[position[0], 0.1, position[2]]}
//             >
//               <bufferGeometry {...curveGeometry} />
//               <meshBasicMaterial transparent opacity={0} />
//             </mesh>
    
//             {/* Visible curve line */}
//             <line 
//               position={[position[0], 0.1, position[2]]}
//             >
//               <bufferGeometry {...curveGeometry} />
//               <lineBasicMaterial color="blue" linewidth={2} />
//             </line>
            
//             {renderMeasurements()}
//           </group>
//         );
//       }
//     }
//     else if (type === "Pentagon" || type === "Hexagon") {
//       return renderPolygon(
//         type,
//         position,
//         radius,
//         height,
//         is3D,
//         commonProps,
//         lineMaterialProps,
//         () => renderMeasurements()
//       );
//     }
//     else if (type === "Arc") {
//       return (
//         <group key={index}>
//           <ArcComponent
//             position={position}
//             radius={radius}
//             startAngle={startAngle}
//             endAngle={endAngle}
//             isTemporary={isTemporary}
//           />
//         </group>
//       );
//     }
//     return null;
//   });
// };

// export default function App() {

//   const [is3D, setIs3D] = useState(false);
//   const [selectedGeometry, setSelectedGeometry] = useState("");
//   const [isPanel, setIsPanel] = useState(true);
//   const [isPan, setIsPan] = useState(true);
//   const [geometries, setGeometries] = useState([]);
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [isAddButtonActive, setIsAddButtonActive] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [startPoint, setStartPoint] = useState(null);
//   const [showFileMenu, setShowFileMenu] = useState(false);
//   const [zoom, setZoom] = useState(1);
//   const [selectedTool, setSelectedTool] = useState('');
//   const [lines, setLines] = useState([]);
//   const [movingGeometryIndex, setMovingGeometryIndex] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [cursorType, setCursorType] = useState('default');

//   const blackCrosshairSVG = `data:image/svg+xml;base64,${btoa(`
//   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
//     <line x1="16" y1="0" x2="16" y2="32" stroke="black" stroke-width="4" stroke-linecap="square" />
//     <line x1="0" y1="16" x2="32" y2="16" stroke="black" stroke-width="4" stroke-linecap="square" />
//   </svg>
// `)}`;

//   const updateHistory = (newGeometries) => {
//     const newHistory = [...history.slice(0, historyIndex + 1), newGeometries];
//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);
//   };

//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setGeometries(history[historyIndex - 1]);
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.ctrlKey && e.key === 'z') {
//         handleUndo();
//         e.preventDefault();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [history, historyIndex]);

//   const handleToolClick = (toolName) => {
//     if (selectedTool === toolName) {
//       setSelectedTool('');
//     } else {
//       setSelectedTool(toolName);
//     }

//     setSelectedGeometry("None");
//     if (toolName === 'Erase') {
//       setGeometries([]);
//       setLines([]);
//     }
//   };

//   const handleLinesUpdate = (updatedLines) => {
//     setLines(updatedLines);
//   };

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const handleZoomChange = (e) => {
//     const inputValue = parseFloat(e.target.value); // Get the input value (0 to 100)
//     const normalizedZoom = 0.1 + (inputValue / 100) * 9.9; // Map to 0.1 to 10
//     setZoom(normalizedZoom);
//   };

//   const handleFileOptionClick = (option) => {
//     switch (option) {
//       case "New":
//         // Handle New action
//         break;
//       case "Open":
//         // Handle Open action
//         break;
//       case "Save":
//         // Handle Save action
//         break;
//       case "Save As":
//         // Handle Save As action
//         break;
//       default:
//         break;
//     }
//   };

//   const toggle3DGeometry = (index) => {
//     setGeometries((prev) =>
//       prev.map((geometry, i) =>
//         i === index ? { ...geometry, isExtruded: !geometry.isExtruded } : geometry
//       )
//     );
//   };

//   const handleMouseDown = (e) => {
//     const point = new THREE.Vector3();
//     e.intersections.forEach((intersection) => {
//       point.copy(intersection.point);
//     });
//     if (e.nativeEvent.button === 0) {
//       if (selectedGeometry !== "None" && selectedGeometry !== "") {
//         setStartPoint([snapToGrid(e.point.x), 0, snapToGrid(e.point.z)]);
//         setDragging(true);
//         setCursorType(`url("${blackCrosshairSVG}"), crosshair`); // Change cursor to 'crosshair' on drag start
//       }
//     } else if (e.nativeEvent.button === 2) {
//       if (movingGeometryIndex !== null) {
//         setDragging(true);
//         setStartPoint([snapToGrid(e.point.x), 0, snapToGrid(e.point.z)]);
//         setCursorType(`url("${blackCrosshairSVG}"), crosshair`);  // Right-click drag cursor
//       }
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (is3D || !dragging || !startPoint) return;

//     const [x, z] = [snapToGrid(e.point.x), snapToGrid(e.point.z)];

//     if (e.nativeEvent.buttons === 1 && selectedGeometry !== "None") {
//       setCursorType(`url("${blackCrosshairSVG}"), crosshair`);

//       if (selectedGeometry === "Circle") {
//         // Calculate radius based on the distance from startPoint
//         const radius = Math.sqrt(
//           Math.pow(x - startPoint[0], 2) + Math.pow(z - startPoint[2], 2)
//         );

//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }

//           // Add a new temporary circle geometry
//           newGeometries.push({
//             type: "Circle",
//             position: startPoint, // Keep the center fixed at the start point
//             radius: snapToGrid(radius),
//             height: 0.1,
//             isTemporary: true,
//             showDimensions: true,
//           });

//           return newGeometries;
//         });
//       } else if (selectedGeometry === "Rect") {
//         // Handle rectangle drawing
//         const width = Math.abs(x - startPoint[0]) || 1;
//         const depth = Math.abs(z - startPoint[2]) || 1;
//         const center = [snapToGrid((x + startPoint[0]) / 2), 0, snapToGrid((z + startPoint[2]) / 2)];

//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }

//           newGeometries.push({
//             type: "Rect",
//             position: center,
//             width: snapToGrid(width),
//             depth: snapToGrid(depth),
//             height: 5,
//             isTemporary: true,
//             showDimensions: true,
//           });

//           return newGeometries;
//         });
//       }
//       if (selectedGeometry === "Oval") {
//         const width = Math.abs(x - startPoint[0]) || 1;
//         const depth = Math.abs(z - startPoint[2]) || 1;

//         // Calculate the new center position for the oval
//         const centerX = (startPoint[0] + x) / 2;
//         const centerZ = (startPoint[2] + z) / 2;

//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }

//           newGeometries.push({
//             type: "Oval",
//             position: [snapToGrid(centerX), 0, snapToGrid(centerZ)], // Center it dynamically
//             width: snapToGrid(width),
//             depth: snapToGrid(depth),
//             height: 0.1,
//             isTemporary: true,
//             showDimensions: true,
//           });

//           return newGeometries;
//         });
//       }  if (e.nativeEvent.buttons === 1 && (selectedGeometry === "Pentagon" || selectedGeometry === "Hexagon")) {
//         const radius = Math.sqrt(
//           Math.pow(x - startPoint[0], 2) + Math.pow(z - startPoint[2], 2)
//         );
    
//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }
    
//           newGeometries.push({
//             type: selectedGeometry,
//             position: startPoint,
//             radius: snapToGrid(radius),
//             height: 5,
//             isTemporary: true,
//             showDimensions: true,
//           });
    
//           return newGeometries;
//         });
//       }
//       else if (selectedGeometry === "Path") {
//         const width = Math.abs(x - startPoint[0]) || 1;
//         const depth = Math.abs(z - startPoint[2]) || 1;
//         const centerX = (startPoint[0] + x) / 2;
//         const centerZ = (startPoint[2] + z) / 2;
      
//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }
      
//           newGeometries.push({
//             type: "Path",
//             position: [snapToGrid(centerX), 0, snapToGrid(centerZ)],
//             width: snapToGrid(width),
//             depth: snapToGrid(depth),
//             height: 5,
//             isTemporary: true,
//             showDimensions: true,
//           });
      
//           return newGeometries;
//         });
//       }
//       else if (selectedGeometry === "Pentagon" || selectedGeometry === "Hexagon") {
//         const radius = Math.sqrt(
//           Math.pow(x - startPoint[0], 2) + Math.pow(z - startPoint[2], 2)
//         );
      
//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }
      
//           newGeometries.push({
//             type: selectedGeometry,
//             position: startPoint,
//             radius: snapToGrid(radius),
//             height: 5,
//             isTemporary: true,
//             showDimensions: true,
//           });
      
//           return newGeometries;
//         });
//       }
//       else if (selectedGeometry === "Arc") {
//         const dx = x - startPoint[0];
//         const dz = z - startPoint[2];
        
//         // Calculate radius from center to current point
//         const radius = Math.sqrt(dx * dx + dz * dz);
        
//         // Calculate angles in radians
//         const currentAngle = Math.atan2(dz, dx);
//         const startAngle = 0;
//         const endAngle = currentAngle;
      
//         setGeometries((prev) => {
//           const newGeometries = [...prev];
//           if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
//             newGeometries.pop();
//           }
      
//           newGeometries.push({
//             type: "Arc",
//             position: startPoint,
//             radius: snapToGrid(radius),
//             startAngle: startAngle,
//             endAngle: endAngle,
//             height: 0.1,
//             isTemporary: true,
//             showDimensions: true,
//           });
      
//           return newGeometries;
//         });
//       }
//     }
//   };


//   const handleGeometryClick = (index) => {
//     if (movingGeometryIndex === index) {
//       setMovingGeometryIndex(null); // Stop moving if the same geometry is clicked again
//     } else {
//       setMovingGeometryIndex(index); // Start moving the geometry
//     }
//   };
//   const handleMouseUp = (e) => {
//     setDragging(false);
//     setCursorType('default');
//     if (e.nativeEvent.button === 0) {
//       setGeometries((prev) => {
//         updateHistory(prev);
//         return prev.map((geometry) => ({
//           ...geometry,
//           isTemporary: false,
//         }));
//       });
//     }

//     if (e.nativeEvent.button === 2) {
//       setMovingGeometryIndex(null);
//     }
//   };
//   const moveGeometry = (index, startMoving) => {
//     if (startMoving) {
//       setMovingGeometryIndex(index);
//     }
//   };
//   const preventContextMenu = (e) => e.preventDefault();
//   return (
  
//     <div onContextMenu={preventContextMenu} style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", right: "50px" }}>

//       {/* Top Menu Bar */}
//       <div style={{
//         padding: "10px 20px",
//         backgroundColor: "#1f1f1f",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         borderBottom: "2px solid #444",
        
//       }}>
//         {/* Left Menu */}
//         <div style={{ display: "flex", gap: "15px"}}>
//           <div style={{ position: "relative" }}>
//             <button
//               style={menuButtonStyle}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//         onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
//               onClick={() => {
//                 setShowFileMenu((prev) => !prev);
//                 setShowAddMenu(false);
//               }}
//             >
//               File
//             </button>
//             {showFileMenu && <DropdownMenu options={["New", "Open", "Save", "Save As"]} onOptionClick={handleFileOptionClick} />}
//           </div>

//           <div style={{ position: "relative" }}>
//             <button
//               style={menuButtonStyle}
//               onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//         onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
//               onClick={() => {
//                 setShowAddMenu((prev) => !prev);
//                 setShowFileMenu(false);
//               }}
//             >
//               Add
//             </button>
//             {showAddMenu && <DropdownMenu options={["Rect", "Circle", "Oval", "Path", "Arc","Pentagon","Hexagon","None"]} onOptionClick={(type) => { setSelectedGeometry(type); setShowAddMenu(false); }} />}
//           </div>

//           <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//         onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>Edit</button>
//           <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//         onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>View</button>
//           <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//         onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>Organize</button>
//         </div>
//         {/* Right Side Icons */}
//         <div style={{ display: "flex", gap: "10px", alignItems: "center", paddingRight: "10px", justifyContent: "center", alignItems: "center" }}>
//           {/* Message Icon */}
//           <button
//           onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//           onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
//             style={{
//               backgroundColor: "#222",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "20px",
//             }}
//             title="Messages"

//           >
//             <BiSolidMessageAltDots />
//           </button>

//           {/* Help Icon */}
//           <button
//           onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//           onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
//             style={{
//               backgroundColor: "#222",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "20px",
//             }}
//             title="Help"

//           >
//             <BiHelpCircle />
//           </button>
//           <button
//           onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
//           onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
//             style={{
//               backgroundColor: "#222",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "20px",
//             }}
//             title="Profile"

//           >
//             <CgProfile />
//           </button>
//         </div>
//       </div>


//       {/* Main Content */}
//       <div style={{ flex: 1, display: "flex" }}>
//         {/* Left Panel */}
//         {isPanel && (
//           <div
          
//             style={{
//               width: "60px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "5px",
//               padding: "5px 0",
//               backgroundColor: "rgba(255, 255, 255, 0.1)",
//               border: "none",
//               zIndex: 1,
//             }}
//             onClick={() => { setShowAddMenu(false); setShowFileMenu(false); }}
//           >
//             {[
//               { icon: <LuPencilLine title="Line" size={22} />, tool: 'Line' },
//               { icon: <FaDrawPolygon title="Free Hand" size={22} />, tool: 'Free Hand' },
//               { icon: <FaEraser title="Erase" size={22} />, tool: 'Erase' },
//               { icon: <FaFileImport title="Import" size={22} />, tool: 'Import' },
//               { icon: <FaFileExport title="Export" size={22} />, tool: 'Export' },
//             ].map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   backgroundColor: selectedTool === item.tool ? "grey" : "black",
//                   justifyContent: "center",
//                   backgroundColor: "black",
//                   color: "white",
//                 }}
//               >
//                 <button
//                   title={item.tool}
//                   onClick={() => handleToolClick(item.tool)}
//                   style={{
//                     width: "40px",
//                     height: "40px",
//                     backgroundColor: "black",
//                     backgroundColor: selectedTool === item.tool ? "grey" : "black",
//                     color: "white",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {item.icon}
//                 </button>
//                 <small style={{ fontSize: "9px", color: "white" }}>{item.label}</small>
//               </div>
//             ))}
//           </div>
//         )}
// <RulerScale/>
//         {/* Canvas Area */}
//         <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
     
//           <Canvas
//             style={{
//               width: "100%",
//               height: "100%",
//               cursor: cursorType,
//             }}
//           >
//             <ambientLight intensity={0.5} />
//             <directionalLight position={[0, 10, 10]} />
//             <Fixed2DView is3D={is3D} zoom={zoom} />
//             <InitialPopup />
//             <Grid
//               gridSize={10}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               selectedTool={selectedTool}
//             />
            
//             <GeometryRenderer
//               geometries={geometries}
//               is3D={is3D}
//               updateGeometry={toggle3DGeometry}
//               selectedTool={selectedTool}
//               moveGeometry={moveGeometry}
//             />
//             <LineThreeComponent
//               isDrawingEnabled={selectedTool === 'Line'}
//               lines={lines}
//               setLines={setLines}
//             />

//             {is3D && <OrbitControls />}
//             {!is3D && <OrbitControls enablePan={false} enableRotate={false} enableZoom={true} />}
//           </Canvas>
//         </div>
//         {isPan && (
//                 <div
//                     style={{
//                         position: "absolute",
//                         top: "53px",
//                         right: "0.41px",
//                         display: "flex",
//                         gap: "8px",
//                         backgroundColor: "black",
//                         padding: "4px",
//                         borderRadius: "1px",
//                         zIndex: 10000
//                     }}
//                 >
//                     <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
//                     <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 8px" }}>
//                         <Minus size={16} color="white" />
//                         <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={(zoom - 0.1) * (100 / 9.9)}
//                             onChange={handleZoomChange}
//                             style={{ width: "100px", accentColor: "skyblue" }}
//                         />
//                         <Plus size={16} color="white" />
//                     </div>
//                     <button
//                         onClick={() => setIs3D(false)}
//                         title="2D View"
//                         style={{
//                             padding: "5px 10px",
//                             background: !is3D ? "grey" : "black",
//                             border: "1px solid black",
//                             cursor: "pointer",
//                             color: "white"
//                         }}
//                     >
//                         2D
//                     </button>
//                     <button
//                         onClick={() => setIs3D(false)}
//                         title="3D View"
//                         style={{
//                             padding: "5px 10px",
//                             background: is3D ? "grey" : "black",
//                             border: "1px solid black",
//                             cursor: "pointer",
//                             color: "white"
//                         }}
//                     >
//                         3D
//                     </button>
//                     <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
//                     <button
//                         onClick={handleFullscreen}
//                         style={{
//                             padding: "8px",
//                             background: "transparent",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                             color: "white",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center"
//                         }}
//                         title="Full-Screen"
//                     >
//                         <Maximize size={16} />
//                     </button>
//                     <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
//                     <button
//                         onClick={() => setIsPanel((prev) => !prev)}
//                         style={{
//                             padding: "8px",
//                             background: "transparent",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: "pointer",
//                             color: "white",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center"
//                         }}
//                         title="View Panel"
//                     >
//                         {isPanel ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
//                     </button>
//                 </div>
//             )}

//             {/* Arrow Button to Toggle Panel */}
//             <div
//                 style={{
//                     position: "absolute",
//                     top: "33px",
//                     right: "158px",
//                     transform: "translateX(-50%)",
//                     zIndex: 10000,
//                     cursor: "pointer",
//                     backgroundColor: "#222",
//                     color: "white",
//                     padding: "5px",
//                     borderRadius: "4px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center"
//                 }}
//                 onClick={() => setIsPan((prev) => !prev)}
//                 title="Toggle Control Panel"
//             >
//                 {isPan ? <FaArrowDown size={10} /> : <FaArrowUp size={10} />}
//             </div>
//       </div>
//     </div>

//   );
// } 
// const menuButtonStyle = {
//   padding: "8px 16px",
//   cursor: "pointer",
//   color: "#fff",
//   background: "#222",
//   fontWeight: "bold",
//   fontSize: "14px",
//   outline: "none",
//   border: "none",
//   boxShadow: "none",
//   transition: "background-color 0.2s ease",
// };

// function MenuButton({ label, onClick }) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <button
//       style={{
//         ...menuButtonStyle,
//         background: isHovered ? "#333" : "#222",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// }

// const iconButtonStyle = {
//   padding: "6px",
//   background: "#333",
//   border: "none",
//   boxshadow: "none",
//   color: "#fff",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const DropdownMenu = ({ options, onOptionClick }) => (
//   <div style={{
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     backgroundColor: "#1a1a1a",
//     color: "#fff",
//     padding: "10px",
//     zIndex: 1000,
//     minWidth: "120px",
//   }}>
//     {options.map((option) => (
//       <div
//         key={option}
//         style={dropdownItemStyle}
//         onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
//         onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
//         onClick={() => onOptionClick(option)}
//       >
//         {option}
//       </div>
//     ))}
//   </div>
// );

// const dropdownItemStyle = {
//   padding: "8px 12px",
//   cursor: "pointer",
//   transition: "background-color 0.3s ease",
// }

import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Cone, Cylinder, Line, Text, Html ,Loader} from "@react-three/drei";
import { LuMousePointer2, LuPencilLine } from "react-icons/lu";
import { FaEye, FaEyeSlash, FaTh, FaCube, FaDrawPolygon, FaEraser, FaFileImport, FaFileExport } from "react-icons/fa";
import { BiSolidMessageAltDots, BiHelpCircle } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Eye, Maximize, Minus, Plus } from 'lucide-react';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";
import * as THREE from 'three';
import LineThreeComponent from './LineComponent';
import InitialPopup from './initial'
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import ArcComponent from './ArcComponent';

const METER_TO_PIXEL = 3779.53;
const GRID_SIZE = 75;

const toPixels = (valueInMeters) => valueInMeters * METER_TO_PIXEL;
const toMeters = (valueInPixels) => valueInPixels / METER_TO_PIXEL;
const snapToGrid = (value, gridSize = 1) => Math.round(value / gridSize) * gridSize;

function Fixed2DView({ is3D, zoom }) {
  const { camera } = useThree();
  useEffect(() => {
    if (is3D) {
      camera.position.set(0, 10, 10); // 3D Perspective View
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 20, 0); // Top-down 2D View
      camera.lookAt(0, 0, 0);
    }
  }, [is3D, camera]);

  useEffect(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [zoom, camera]);

  return null;
}
function Grid({ gridSize, onMouseDown, onMouseMove, onMouseUp, is3D, selectedTool }) {
  const handleMouseEvent = (event, handler) => {
    if (is3D) {
      event.stopPropagation();
    } else {
      handler(event);
    }
  };

  return (
    <group
      onPointerDown={(event) => handleMouseEvent(event, onMouseDown)}
      onPointerMove={(event) => handleMouseEvent(event, onMouseMove)}
      onPointerUp={(event) => handleMouseEvent(event, onMouseUp)}
    >
      <gridHelper args={[100, 100, "gray", "lightgray"]} />
    </group>
  );
}

const MeasurementLabel = ({ position, value, label }) => (
  <Html position={position}>
    <div style={{
      display: 'inline-block',
      padding: '2px 4px',
      fontSize: '10px',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: '4px',
      whiteSpace: 'nowrap'
    }}>
      {label}: {value.toFixed(2)} m
    </div>
  </Html>
);


const GeometryRenderer = ({ geometries, updateGeometry, is3D, moveGeometry }) => {
  const [geometryStates, setGeometryStates] = useState(
    geometries.map(() => false)
  );

  const handleGeometryClick = (index) => {
    const newGeometryStates = [...geometryStates];
    newGeometryStates[index] = !newGeometryStates[index];
    setGeometryStates(newGeometryStates);
    updateGeometry(index);
  };

  return geometries.map((geometry, index) => {
    const { type, position, width, depth, height, radius, startAngle, endAngle, showDimensions, isTemporary, isExtruded } =
      geometry;
    const isGeometryClicked = geometryStates[index];

    const commonProps = {
      position,
      onPointerDown: (e) => {
        e.stopPropagation();
        handleGeometryClick(index);
        moveGeometry(index, true);
      },
    };
   
    const renderMeasurements = () => {
      if (!is3D && (!isGeometryClicked && !isTemporary)) return null; 

      const measurements = [];
      const offset = 0.5;

      if (type === "Rect") {
        // Display width and depth
        measurements.push(
          <MeasurementLabel
            key={`width-${index}`}
            position={[position[0] + width / 2, 0.1, position[2]]}
            value={width}
            label="W"
          />
        );
        measurements.push(
          <MeasurementLabel
            key={`depth-${index}`}
            position={[position[0], 0.3, position[2] + depth / 2]}
            value={depth}
            label="L"
          />
        );

        // Display height only in 3D view and when geometry is extruded
        if (is3D && isExtruded) {
          measurements.push(
            <MeasurementLabel
              key={`height-${index}`}
              position={[position[0] + width / 2 + offset, height / 2, position[2]]}
              value={height}
              label="H"
            />
          );
        }
      } else if (type === "Sphere" || type === "Circle") {
        // Display diameter
        measurements.push(
          <MeasurementLabel
            key={`diameter-${index}`}
            position={[position[0] + radius + offset, 0.3, position[2]]}
            value={radius * 2}
            label="⌀"
          />
        );
      }  else if (type === "Oval") {
        // Display width and depth for oval
        measurements.push(
          <MeasurementLabel
            key={`width-${index}`}
            position={[position[0] + width / 2, 0.3, position[2]]}
            value={width}
            label="W"
          />
        );
        measurements.push(
          <MeasurementLabel
            key={`depth-${index}`}
            position={[position[0], 0.3, position[2] + depth / 2]}
            value={depth}
            label="L"
          />
        );

        // Display height only in 3D view and when geometry is extruded
        if (is3D && isExtruded) {
          measurements.push(
            <MeasurementLabel
              key={`height-${index}`}
              position={[position[0] + width / 2 + offset, height / 2, position[2]]}
              value={height}
              label="H"
            />
          );
        }
      }

      return measurements;
    };
   
    // Update the Arc rendering in GeometryRenderer
  
    const createRegularPolygon = (sides, radius) => {
      const points = [];
      const startAngle = -Math.PI/2;
      
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + (i * 2 * Math.PI) / sides;
        points.push(
          new THREE.Vector2(
            radius * Math.cos(angle),
            radius * Math.sin(angle)
          )
        );
      }
      return points;
    };
    
    // const renderPolygon = (type, position, radius, height, is3D, commonProps, lineMaterialProps, isTemporary) => {
    //   const sides = type === "Pentagon" ? 5 : 6;
    //   const points = createRegularPolygon(sides, radius);
    //   const shape = new THREE.Shape();
      
    //   // Create the shape path
    //   shape.moveTo(points[0].x, points[0].y);
    //   for (let i = 1; i < points.length; i++) {
    //     shape.lineTo(points[i].x, points[i].y);
    //   }
    //   shape.closePath();
    
    //   // Calculate side length
    //   const sideLength = 2 * radius * Math.sin(Math.PI / sides);
    
    //   const renderMeasurements = () => {
    //     const measurements = [];
        
    //     // Create measurements for each side
    //     for (let i = 0; i < points.length; i++) {
    //       const currentPoint = points[i];
    //       const nextPoint = points[(i + 1) % points.length];
          
    //       // Calculate midpoint of the side for label placement
    //       const midX = (currentPoint.x + nextPoint.x) / 2;
    //       const midY = (currentPoint.y + nextPoint.y) / 2;
          
    //       measurements.push(
    //         <Html
    //           key={`side-${i}`}
    //           position={[
    //             position[0] + midX,
    //             0.3,
    //             position[2] + midY
    //           ]}
    //         >
    //           <div style={{
    //             background: 'rgba(0, 0, 0, 0.75)',
    //             color: 'white',
    //             padding: '2px 4px',
    //             borderRadius: '4px',
    //             fontSize: '10px',
    //             whiteSpace: 'nowrap',
    //             userSelect: 'none'
    //           }}>
    //             {sideLength.toFixed(2)}m
    //           </div>
    //         </Html>
    //       );
    //     }
        
    //     return measurements;
    //   };
    
    //   if (is3D) {
    //     return (
    //       <group>
    //         <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
    //           <extrudeGeometry 
    //             args={[shape, { 
    //               depth: height, 
    //               bevelEnabled: false 
    //             }]} 
    //           />
    //           <meshStandardMaterial color="orange" />
    //         </mesh>
    //         {renderMeasurements()}
    //       </group>
    //     );
    //   } else {
    //     return (
    //       <group>
    //         <mesh
    //           {...commonProps}
    //           rotation={[-Math.PI / 2, 0, 0]}
    //           position={[position[0], 0.1, position[2]]}
    //         >
    //           <shapeGeometry args={[shape]} />
    //           <meshBasicMaterial transparent opacity={0} />
    //         </mesh>
    
    //         <lineSegments 
    //           position={[position[0], 0.1, position[2]]} 
    //           rotation={[-Math.PI / 2, 0, 0]}
    //         >
    //           <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
    //           <lineBasicMaterial {...lineMaterialProps} />
    //         </lineSegments>
    //         {renderMeasurements()}
    //       </group>
    //     );
    //   }
    // };
    // const renderPolygon = (type, position, radius, height, is3D, commonProps, lineMaterialProps, isTemporary) => {
    //   const sides = type === "Pentagon" ? 5 : 6;
    //   const points = [];
    //   const startAngle = -Math.PI/2; // Start from top
      
    //   // Generate points for the polygon
    //   for (let i = 0; i < sides; i++) {
    //     const angle = startAngle + (i * 2 * Math.PI) / sides;
    //     points.push(
    //       new THREE.Vector2(
    //         radius * Math.cos(angle),
    //         radius * Math.sin(angle)
    //       )
    //     );
    //   }
      
    //   // Create shape
    //   const shape = new THREE.Shape();
    //   shape.moveTo(points[0].x, points[0].y);
    //   for (let i = 1; i < points.length; i++) {
    //     shape.lineTo(points[i].x, points[i].y);
    //   }
    //   shape.closePath();
    
    //   // Calculate side length for measurements
    //   const sideLength = 2 * radius * Math.sin(Math.PI / sides);
      
    //   const renderMeasurements = () => {
    //     if (!isTemporary) return null;
        
    //     const measurements = [];
        
    //     // Add radius measurement
    //     measurements.push(
    //       <Html key="radius" position={[position[0] + radius/2, 0.3, position[2]]}>
    //         <div style={{
    //           background: 'rgba(0, 0, 0, 0.75)',
    //           color: 'white',
    //           padding: '2px 4px',
    //           borderRadius: '4px',
    //           fontSize: '10px',
    //           whiteSpace: 'nowrap'
    //         }}>
    //           R: {radius.toFixed(2)}m
    //         </div>
    //       </Html>
    //     );
    
    //     // Add side length measurements
    //     for (let i = 0; i < points.length; i++) {
    //       const currentPoint = points[i];
    //       const nextPoint = points[(i + 1) % points.length];
          
    //       // Calculate midpoint for label placement
    //       const midX = (currentPoint.x + nextPoint.x) / 2;
    //       const midY = (currentPoint.y + nextPoint.y) / 2;
          
    //       measurements.push(
    //         <Html
    //           key={`side-${i}`}
    //           position={[
    //             position[0] + midX,
    //             0.3,
    //             position[2] + midY
    //           ]}
    //         >
    //           <div style={{
    //             background: 'rgba(0, 0, 0, 0.75)',
    //             color: 'white',
    //             padding: '2px 4px',
    //             borderRadius: '4px',
    //             fontSize: '10px',
    //             whiteSpace: 'nowrap'
    //           }}>
    //             {sideLength.toFixed(2)}m
    //           </div>
    //         </Html>
    //       );
    //     }
        
    //     return measurements;
    //   };
    
    //   if (is3D) {
    //     return (
    //       <group>
    //         <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
    //           <extrudeGeometry 
    //             args={[shape, { 
    //               depth: height, 
    //               bevelEnabled: false 
    //             }]} 
    //           />
    //           <meshStandardMaterial color={type === "Pentagon" ? "#4CAF50" : "#2196F3"} />
    //         </mesh>
    //         {renderMeasurements()}
    //       </group>
    //     );
    //   } else {
    //     return (
    //       <group>
    //         {/* Invisible mesh for interaction */}
    //         <mesh
    //           {...commonProps}
    //           rotation={[-Math.PI / 2, 0, 0]}
    //           position={[position[0], 0.1, position[2]]}
    //         >
    //           <shapeGeometry args={[shape]} />
    //           <meshBasicMaterial transparent opacity={0} />
    //         </mesh>
    
    //         {/* Visible outline */}
    //         <lineSegments 
    //           position={[position[0], 0.1, position[2]]} 
    //           rotation={[-Math.PI / 2, 0, 0]}
    //         >
    //           <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
    //           <lineBasicMaterial 
    //             {...lineMaterialProps} 
    //             color={type === "Pentagon" ? "#4CAF50" : "#2196F3"} 
    //           />
    //         </lineSegments>
    //         {renderMeasurements()}
    //       </group>
    //     );
    //   }
    // };
    const renderPolygon = (type, position, radius, height, is3D, commonProps, lineMaterialProps, isTemporary) => {
      const sides = type === "Pentagon" ? 5 : 6;
      const points = [];
      const startAngle = -Math.PI/2;
      
      // Generate points for the polygon
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + (i * 2 * Math.PI) / sides;
        points.push(
          new THREE.Vector2(
            radius * Math.cos(angle),
            radius * Math.sin(angle)
          )
        );
      }
      
      // Create shape
      const shape = new THREE.Shape();
      shape.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].y);
      }
      shape.closePath();
    
      const sideLength = 2 * radius * Math.sin(Math.PI / sides);
      
      // Create guide lines material
      const guideLineMaterial = new THREE.LineBasicMaterial({
        color: 'yellow',
        transparent: true,
        opacity: 0.5,
        dashSize: 3,
        gapSize: 1
      });
    
      // Render guide lines and center point
      const renderGuideLines = () => {
        if (!isTemporary) return null;
    
        return (
          <>
            {/* Center point marker */}
            <mesh position={[position[0], 0.1, position[2]]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
    
            {/* Guide line from center to current radius */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(position[0], 0.1, position[2]),
                  new THREE.Vector3(position[0] + radius, 0.1, position[2])
                ])}
              />
              <lineBasicMaterial attach="material" {...guideLineMaterial} />
            </line>
    
            {/* Circular guide */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints(
                  Array.from({ length: 64 }, (_, i) => {
                    const angle = (i / 64) * Math.PI * 2;
                    return new THREE.Vector3(
                      position[0] + radius * Math.cos(angle),
                      0.1,
                      position[2] + radius * Math.sin(angle)
                    );
                  })
                )}
              />
              <lineBasicMaterial 
                attach="material" 
                color="yellow" 
                transparent 
                opacity={0.2} 
              />
            </line>
          </>
        );
      };
    
      const renderMeasurements = () => {
        if (!isTemporary) return null;
        
        const measurements = [];
        
        // Add radius measurement
        measurements.push(
          <Html key="radius" position={[position[0] + radius/2, 0.3, position[2]]}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '10px',
              whiteSpace: 'nowrap'
            }}>
              R: {radius.toFixed(2)}m
            </div>
          </Html>
        );
    
        // Add side length measurements
        for (let i = 0; i < points.length; i++) {
          const currentPoint = points[i];
          const nextPoint = points[(i + 1) % points.length];
          
          const midX = (currentPoint.x + nextPoint.x) / 2;
          const midY = (currentPoint.y + nextPoint.y) / 2;
          
          measurements.push(
            <Html
              key={`side-${i}`}
              position={[
                position[0] + midX,
                0.3,
                position[2] + midY
              ]}
            >
              <div style={{
                background: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '2px 4px',
                borderRadius: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap'
              }}>
                {sideLength.toFixed(2)}m
              </div>
            </Html>
          );
        }
        
        return measurements;
      };
    
      if (is3D) {
        return (
          <group>
            <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
              <extrudeGeometry 
                args={[shape, { 
                  depth: height, 
                  bevelEnabled: false 
                }]} 
              />
              <meshStandardMaterial color={type === "Pentagon" ? "#4CAF50" : "#2196F3"} />
            </mesh>
            {renderMeasurements()}
          </group>
        );
      } else {
        return (
          <group>
            {/* Render guide lines first */}
            {renderGuideLines()}
    
            {/* Invisible mesh for interaction */}
            <mesh
              {...commonProps}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[position[0], 0.1, position[2]]}
            >
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
    
            {/* Visible outline */}
            <lineSegments 
              position={[position[0], 0.1, position[2]]} 
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
              <lineBasicMaterial 
                {...lineMaterialProps} 
                color={type === "Pentagon" ? "#4CAF50" : "#2196F3"} 
              />
            </lineSegments>
            {renderMeasurements()}
          </group>
        );
      }
    };
    const lineMaterialProps = {
      color: "blue",
      linewidth: 1000, // Increase stroke width
    };
    // Box Geometry Rendering
    if (type === "Rect") {
      if (is3D) {
        return (
          <group key={index}>
            <mesh {...commonProps} position={[position[0], height / 2, position[2]]}>
              <boxGeometry args={[width, isExtruded ? height : 0, depth]} />
              <meshStandardMaterial color="orange" />
            </mesh>
         
          </group>
        );
      } else {
        return (
          <group key={index}>
            {/* Invisible Mesh (for Click Events) */}
            <mesh
              {...commonProps}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[position[0], 0.1, position[2]]}
            >
              <planeGeometry args={[width, depth]}  />
              <meshBasicMaterial transparent opacity={0} /> {/* Invisible */}
            </mesh>

            {/* Outline (Without Diagonal) */}
            <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(width, depth)]} />
              <lineBasicMaterial {...lineMaterialProps} />
            </lineSegments>
            {renderMeasurements()}
          </group>
        );
      }
    }
   
    else if (type === "Circle") {
      if (is3D) {
        return (
          <group key={index}>
            <mesh {...commonProps} rotation={[-Math.PI / 2, 0, 0]} position={[position[0], height / 2, position[2]]}>
              <circleGeometry args={[radius, 32]} />
              <meshStandardMaterial color="blue" />
            </mesh>
            {/* {renderMeasurements()} */}
          </group>
        );
      } else {
        return (
          <group key={index}>
            {/* Invisible Mesh (for Click Events) */}
            <mesh
              {...commonProps}
              rotation={[-Math.PI / 2, 0, 0]} // Flat alignment
              position={[position[0], 0.1, position[2]]} // Slightly above ground
            >
              <circleGeometry args={[radius, 32]} />
              <meshBasicMaterial transparent opacity={0} /> {/* Invisible */}
            </mesh>

            {/* Outline (Without Diagonal) */}
            <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.CircleGeometry(radius, 32)]} />
              <lineBasicMaterial color="green" />
            </lineSegments>

            {renderMeasurements()}
          </group>
        );
      }
    }
    else if (type === "Oval") {
      const ovalShape = new THREE.Shape();
      const ovalWidth = width / 2;   // Half of the width
      const ovalHeight = depth / 2;  // Half of the depth

      // Draw an ellipse using `moveTo` and `absellipse`
      ovalShape.moveTo(0, ovalHeight);
      ovalShape.absellipse(0, 0, ovalWidth, ovalHeight, 0, Math.PI * 2, false, 0);

      if (is3D) {
        return (
          <group key={index}>
            <mesh {...commonProps} position={[position[0], height / 2, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <extrudeGeometry args={[ovalShape, { depth: height, bevelEnabled: false }]} />
              <meshStandardMaterial color="purple" />
            </mesh>
            {/* {renderMeasurements()} Using your existing measurement rendering */}
          </group>
        );
      } else {
        return (
          <group key={index}>
            {/* Invisible Mesh for Click Events */}
            <mesh
              {...commonProps}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[position[0], 0.1, position[2]]}
            >
              <shapeGeometry args={[ovalShape]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Outline */}
            <lineSegments position={[position[0], 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.ShapeGeometry(ovalShape)]} />
              <lineBasicMaterial color="purple" />
            </lineSegments>

            {renderMeasurements()} {/* Using your existing measurement rendering */}
          </group>
        );
      }
    }
    else if (type === "Path") {
      const path = new THREE.CurvePath();
      const points = [
        new THREE.Vector2(-width/2, 0),
        new THREE.Vector2(0, depth),
        new THREE.Vector2(width/2, 0)
      ];
      
      // Create a quadratic bezier curve
      const curve = new THREE.QuadraticBezierCurve(
        points[0],
        points[1],
        points[2]
      );
      
      path.add(curve);
      const curvePoints = curve.getPoints(50);
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    
      if (is3D) {
        // For 3D view, create an extruded geometry
        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        shape.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    
        return (
          <group key={index}>
            <mesh {...commonProps} position={[position[0], height/2, position[2]]}>
              <extrudeGeometry 
                args={[shape, { 
                  depth: height, 
                  bevelEnabled: false,
                  steps: 50
                }]} 
              />
              <meshStandardMaterial color="blue" />
            </mesh>
            {renderMeasurements()}
          </group>
        );
      } else {
        // For 2D view, render as a line
        return (
          <group key={index}>
            {/* Invisible mesh for click events */}
            <mesh
              {...commonProps}
              position={[position[0], 0.1, position[2]]}
            >
              <bufferGeometry {...curveGeometry} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
    
            {/* Visible curve line */}
            <line 
              position={[position[0], 0.1, position[2]]}
            >
              <bufferGeometry {...curveGeometry} />
              <lineBasicMaterial color="blue" linewidth={2} />
            </line>
            
            {renderMeasurements()}
          </group>
        );
      }
    }
    else if (type === "Pentagon" || type === "Hexagon") {
      return renderPolygon(
        type,
        position,
        radius,
        height,
        is3D,
        commonProps,
        lineMaterialProps,
        () => renderMeasurements()
      );
    }
    else if (type === "Arc") {
      return (
        <group key={index}>
          <ArcComponent
            position={position}
            radius={radius}
            startAngle={startAngle}
            endAngle={endAngle}
            isTemporary={isTemporary}
          />
        </group>
      );
    }
    return null;
  });
};

export default function App() {

  const [is3D, setIs3D] = useState(false);
  const [selectedGeometry, setSelectedGeometry] = useState("");
  const [isPanel, setIsPanel] = useState(true);
  const [isPan, setIsPan] = useState(true);
  const [geometries, setGeometries] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isAddButtonActive, setIsAddButtonActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('');
  const [lines, setLines] = useState([]);
  const [movingGeometryIndex, setMovingGeometryIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorType, setCursorType] = useState('default');

  const blackCrosshairSVG = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <line x1="16" y1="0" x2="16" y2="32" stroke="black" stroke-width="4" stroke-linecap="square" />
    <line x1="0" y1="16" x2="32" y2="16" stroke="black" stroke-width="4" stroke-linecap="square" />
  </svg>
`)}`;

  const updateHistory = (newGeometries) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newGeometries];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGeometries(history[historyIndex - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        handleUndo();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  const handleToolClick = (toolName) => {
    if (selectedTool === toolName) {
      setSelectedTool('');
    } else {
      setSelectedTool(toolName);
    }

    setSelectedGeometry("None");
    if (toolName === 'Erase') {
      setGeometries([]);
      setLines([]);
    }
  };

  const handleLinesUpdate = (updatedLines) => {
    setLines(updatedLines);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomChange = (e) => {
    const inputValue = parseFloat(e.target.value); // Get the input value (0 to 100)
    const normalizedZoom = 0.1 + (inputValue / 100) * 9.9; // Map to 0.1 to 10
    setZoom(normalizedZoom);
  };

  const handleFileOptionClick = (option) => {
    switch (option) {
      case "New":
        // Handle New action
        break;
      case "Open":
        // Handle Open action
        break;
      case "Save":
        // Handle Save action
        break;
      case "Save As":
        // Handle Save As action
        break;
      default:
        break;
    }
  };

  const toggle3DGeometry = (index) => {
    setGeometries((prev) =>
      prev.map((geometry, i) =>
        i === index ? { ...geometry, isExtruded: !geometry.isExtruded } : geometry
      )
    );
  };

  const handleMouseDown = (e) => {
    if (e.nativeEvent.button === 0) {
      if (selectedGeometry !== "None" && selectedGeometry !== "") {
        // Snap the initial point to grid
        const snappedX = snapToGrid(e.point.x);
        const snappedZ = snapToGrid(e.point.z);
        setStartPoint([snappedX, 0, snappedZ]);
        setDragging(true);
        setCursorType(`url("${blackCrosshairSVG}"), crosshair`);
  
        // For Pentagon and Hexagon, create initial geometry at click point
        if (selectedGeometry === "Pentagon" || selectedGeometry === "Hexagon") {
          setGeometries(prev => {
            const newGeometries = [...prev];
            if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
              newGeometries.pop();
            }
            newGeometries.push({
              type: selectedGeometry,
              position: [snappedX, 0, snappedZ], // Use snapped coordinates
              radius: 0.1, // Start with minimal radius
              height: 5,
              isTemporary: true,
              showDimensions: true
            });
            return newGeometries;
          });
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (is3D || !dragging || !startPoint) return;

    const [x, z] = [snapToGrid(e.point.x), snapToGrid(e.point.z)];

    if (e.nativeEvent.buttons === 1 && selectedGeometry !== "None") {
      setCursorType(`url("${blackCrosshairSVG}"), crosshair`);

      if (selectedGeometry === "Circle") {
        // Calculate radius based on the distance from startPoint
        const radius = Math.sqrt(
          Math.pow(x - startPoint[0], 2) + Math.pow(z - startPoint[2], 2)
        );

        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }

          // Add a new temporary circle geometry
          newGeometries.push({
            type: "Circle",
            position: startPoint, // Keep the center fixed at the start point
            radius: snapToGrid(radius),
            height: 0.1,
            isTemporary: true,
            showDimensions: true,
          });

          return newGeometries;
        });
      } else if (selectedGeometry === "Rect") {
        // Handle rectangle drawing
        const width = Math.abs(x - startPoint[0]) || 1;
        const depth = Math.abs(z - startPoint[2]) || 1;
        const center = [snapToGrid((x + startPoint[0]) / 2), 0, snapToGrid((z + startPoint[2]) / 2)];

        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }

          newGeometries.push({
            type: "Rect",
            position: center,
            width: snapToGrid(width),
            depth: snapToGrid(depth),
            height: 5,
            isTemporary: true,
            showDimensions: true,
          });

          return newGeometries;
        });
      }
      if (selectedGeometry === "Oval") {
        const width = Math.abs(x - startPoint[0]) || 1;
        const depth = Math.abs(z - startPoint[2]) || 1;

        // Calculate the new center position for the oval
        const centerX = (startPoint[0] + x) / 2;
        const centerZ = (startPoint[2] + z) / 2;

        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }

          newGeometries.push({
            type: "Oval",
            position: [snapToGrid(centerX), 0, snapToGrid(centerZ)], // Center it dynamically
            width: snapToGrid(width),
            depth: snapToGrid(depth),
            height: 0.1,
            isTemporary: true,
            showDimensions: true,
          });

          return newGeometries;
        });
      }  if (e.nativeEvent.buttons === 1 && (selectedGeometry === "Pentagon" || selectedGeometry === "Hexagon")) {
        // Calculate radius from center (startPoint) to current mouse position
        const radius = Math.sqrt(
          Math.pow(x - startPoint[0], 2) + 
          Math.pow(z - startPoint[2], 2)
        );
    
        setGeometries(prev => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }
    
          newGeometries.push({
            type: selectedGeometry,
            position: startPoint, // Keep the original clicked point as center
            radius: snapToGrid(radius),
            height: 5,
            isTemporary: true,
            showDimensions: true
          });
    
          return newGeometries;
        });
      }
      else if (selectedGeometry === "Path") {
        const width = Math.abs(x - startPoint[0]) || 1;
        const depth = Math.abs(z - startPoint[2]) || 1;
        const centerX = (startPoint[0] + x) / 2;
        const centerZ = (startPoint[2] + z) / 2;
      
        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }
      
          newGeometries.push({
            type: "Path",
            position: [snapToGrid(centerX), 0, snapToGrid(centerZ)],
            width: snapToGrid(width),
            depth: snapToGrid(depth),
            height: 5,
            isTemporary: true,
            showDimensions: true,
          });
      
          return newGeometries;
        });
      }
      else if (selectedGeometry === "Pentagon" || selectedGeometry === "Hexagon") {
        const radius = Math.sqrt(
          Math.pow(x - startPoint[0], 2) + Math.pow(z - startPoint[2], 2)
        );
      
        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }
      
          newGeometries.push({
            type: selectedGeometry,
            position: startPoint,
            radius: snapToGrid(radius),
            height: 5,
            isTemporary: true,
            showDimensions: true,
          });
      
          return newGeometries;
        });
      }
      else if (selectedGeometry === "Arc") {
        const dx = x - startPoint[0];
        const dz = z - startPoint[2];
        
        // Calculate radius from center to current point
        const radius = Math.sqrt(dx * dx + dz * dz);
        
        // Calculate angles in radians
        const currentAngle = Math.atan2(dz, dx);
        const startAngle = 0;
        const endAngle = currentAngle;
      
        setGeometries((prev) => {
          const newGeometries = [...prev];
          if (newGeometries.length > 0 && newGeometries.at(-1).isTemporary) {
            newGeometries.pop();
          }
      
          newGeometries.push({
            type: "Arc",
            position: startPoint,
            radius: snapToGrid(radius),
            startAngle: startAngle,
            endAngle: endAngle,
            height: 0.1,
            isTemporary: true,
            showDimensions: true,
          });
      
          return newGeometries;
        });
      }
    }
  };


  const handleGeometryClick = (index) => {
    if (movingGeometryIndex === index) {
      setMovingGeometryIndex(null); // Stop moving if the same geometry is clicked again
    } else {
      setMovingGeometryIndex(index); // Start moving the geometry
    }
  };
  const handleMouseUp = (e) => {
    setDragging(false);
    setCursorType('default');
    if (e.nativeEvent.button === 0) {
      setGeometries((prev) => {
        updateHistory(prev);
        return prev.map((geometry) => ({
          ...geometry,
          isTemporary: false,
        }));
      });
    }

    if (e.nativeEvent.button === 2) {
      setMovingGeometryIndex(null);
    }
  };
  const moveGeometry = (index, startMoving) => {
    if (startMoving) {
      setMovingGeometryIndex(index);
    }
  };
  const preventContextMenu = (e) => e.preventDefault();
  return (
  
    <div onContextMenu={preventContextMenu} style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", right: "50px" }}>

      {/* Top Menu Bar */}
      <div style={{
        padding: "10px 20px",
        backgroundColor: "#1f1f1f",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #444",
        
      }}>
        {/* Left Menu */}
        <div style={{ display: "flex", gap: "15px"}}>
          <div style={{ position: "relative" }}>
            <button
              style={menuButtonStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
              onClick={() => {
                setShowFileMenu((prev) => !prev);
                setShowAddMenu(false);
              }}
            >
              File
            </button>
            {showFileMenu && <DropdownMenu options={["New", "Open", "Save", "Save As"]} onOptionClick={handleFileOptionClick} />}
          </div>

          <div style={{ position: "relative" }}>
            <button
              style={menuButtonStyle}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
              onClick={() => {
                setShowAddMenu((prev) => !prev);
                setShowFileMenu(false);
              }}
            >
              Add
            </button>
            {showAddMenu && <DropdownMenu options={["Rect", "Circle", "Oval", "Arc","Pentagon","Hexagon","None"]} onOptionClick={(type) => { setSelectedGeometry(type); setShowAddMenu(false); }} />}
          </div>

          <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>Edit</button>
          <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>View</button>
          <button style={menuButtonStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"} onClick={() => { setShowFileMenu(false); setShowAddMenu(false); }}>Organize</button>
        </div>
        {/* Right Side Icons */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", paddingRight: "10px", justifyContent: "center", alignItems: "center" }}>
          {/* Message Icon */}
          <button
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
            style={{
              backgroundColor: "#222",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
            title="Messages"

          >
            <BiSolidMessageAltDots />
          </button>

          {/* Help Icon */}
          <button
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
            style={{
              backgroundColor: "#222",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
            title="Help"

          >
            <BiHelpCircle />
          </button>
          <button
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
            style={{
              backgroundColor: "#222",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
            title="Profile"

          >
            <CgProfile />
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Panel */}
        {isPanel && (
          <div
          
            style={{
              width: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "5px 0",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              zIndex: 1,
            }}
            onClick={() => { setShowAddMenu(false); setShowFileMenu(false); }}
          >
            {[
              { icon: <LuPencilLine title="Line" size={22} />, tool: 'Line' },
              { icon: <FaDrawPolygon title="Free Hand" size={22} />, tool: 'Free Hand' },
              { icon: <FaEraser title="Erase" size={22} />, tool: 'Erase' },
              { icon: <FaFileImport title="Import" size={22} />, tool: 'Import' },
              { icon: <FaFileExport title="Export" size={22} />, tool: 'Export' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: selectedTool === item.tool ? "grey" : "black",
                  justifyContent: "center",
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                <button
                  title={item.tool}
                  onClick={() => handleToolClick(item.tool)}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "black",
                    backgroundColor: selectedTool === item.tool ? "grey" : "black",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {item.icon}
                </button>
                <small style={{ fontSize: "9px", color: "white" }}>{item.label}</small>
              </div>
            ))}
          </div>
        )}

        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
     
          <Canvas
            style={{
              width: "100%",
              height: "100%",
              cursor: cursorType,
            }}
          >
            <Loader/>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} />
            <Fixed2DView is3D={is3D} zoom={zoom} />
            <InitialPopup />
            <Grid
              gridSize={75}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              selectedTool={selectedTool}
            />
            
            <GeometryRenderer
              geometries={geometries}
              is3D={is3D}
              updateGeometry={toggle3DGeometry}
              selectedTool={selectedTool}
              moveGeometry={moveGeometry}
            />
           <LineThreeComponent
  isDrawingEnabled={selectedTool === 'Line'}
  lines={lines}
  setLines={setLines}
is3D={is3D}
  zoom={zoom}
/>


            {is3D && <OrbitControls />}
            {!is3D && <OrbitControls enablePan={false} enableRotate={false}  minDistance={10} maxDistance={30}/>}
          </Canvas>
        </div>
        {isPan && (
                <div
                    style={{
                        position: "absolute",
                        top: "53px",
                        right: "0.41px",
                        display: "flex",
                        gap: "8px",
                        backgroundColor: "black",
                        padding: "4px",
                        borderRadius: "1px",
                        zIndex: 10000
                    }}
                >
                    <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 8px" }}>
                        <Minus size={16} color="white" />
                        <input
                            type="range"
                            min="10"
                            max="20"
                            value={(zoom - 0.1) * (100 / 9.9)}
                            onChange={handleZoomChange}
                            style={{ width: "100px", accentColor: "skyblue", cursor: "pointer" }}
                        />
                        <Plus size={16} color="white" />
                    </div>
                    <button
                        onClick={() => setIs3D(false)}
                        title="2D View"
                        style={{
                            padding: "5px 10px",
                            background: !is3D ? "grey" : "black",
                            border: "1px solid black",
                            cursor: "pointer",
                            color: "white"
                        }}
                    >
                        2D
                    </button>
                    <button
                        onClick={() => setIs3D(true)}
                        title="3D View"
                        style={{
                            padding: "5px 10px",
                            background: is3D ? "grey" : "black",
                            border: "1px solid black",
                            cursor: "pointer",
                            color: "white"
                        }}
                    >
                        3D
                    </button>
                    <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
                    <button
                        onClick={handleFullscreen}
                        style={{
                            padding: "8px",
                            background: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        title="Full-Screen"
                    >
                        <Maximize size={16} />
                    </button>
                    <div style={{ width: "1px", height: "24px", backgroundColor: "#404040", margin: "0 4px" }} />
                    <button
                        onClick={() => setIsPanel((prev) => !prev)}
                        style={{
                            padding: "8px",
                            background: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        title="View Panel"
                    >
                        {isPanel ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                    </button>
                </div>
            )}

            {/* Arrow Button to Toggle Panel */}
            <div
                style={{
                    position: "absolute",
                    top: "33px",
                    right: "158px",
                    transform: "translateX(-50%)",
                    zIndex: 10000,
                    cursor: "pointer",
                    backgroundColor: "#222",
                    color: "white",
                    padding: "5px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onClick={() => setIsPan((prev) => !prev)}
                title="Toggle Control Panel"
            >
                {isPan ? <FaArrowDown size={10} /> : <FaArrowUp size={10} />}
            </div>
      </div>
    </div>

  );
} 
const menuButtonStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  color: "#fff",
  background: "#222",
  fontWeight: "bold",
  fontSize: "14px",
  outline: "none",
  border: "none",
  boxShadow: "none",
  transition: "background-color 0.2s ease",
};

function MenuButton({ label, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...menuButtonStyle,
        background: isHovered ? "#333" : "#222",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const iconButtonStyle = {
  padding: "6px",
  background: "#333",
  border: "none",
  boxshadow: "none",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const DropdownMenu = ({ options, onOptionClick }) => (
  <div style={{
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "10px",
    zIndex: 1000,
    minWidth: "120px",
  }}>
    {options.map((option) => (
      <div
        key={option}
        style={dropdownItemStyle}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
        onClick={() => onOptionClick(option)}
      >
        {option}
      </div>
    ))}
  </div>
);

const dropdownItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};