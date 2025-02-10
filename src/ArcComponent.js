// import React from 'react';
// import * as THREE from 'three';
// import { Html } from '@react-three/drei';
// const ArcComponent = ({ position, radius, startAngle, endAngle, isTemporary }) => {
//   // Create points for the arc with more segments for smoother curves
//   const segments = 100;
//   const points = [];
//   const angleStep = (endAngle - startAngle) / segments;

//   // Generate points for smoother arc
//   for (let i = 0; i <= segments; i++) {
//     const angle = startAngle + (i * angleStep);
//     points.push(new THREE.Vector3(
//       radius * Math.cos(angle),
//       0,
//       radius * Math.sin(angle)
//     ));
//   }

//   // Calculate dimensions for display
//   const angleDegrees = ((endAngle - startAngle) * 180 / Math.PI).toFixed(1);
//   const arcLength = (radius * Math.abs(endAngle - startAngle)).toFixed(2);
  
//   // Calculate positions for labels
//   const midAngle = (startAngle + endAngle) / 2;
//   const labelRadius = radius * 0.7;
//   const labelPosition = [
//     labelRadius * Math.cos(midAngle),
//     0.1,
//     labelRadius * Math.sin(midAngle)
//   ];

//   return (
//     <group position={position}>
//       {/* Main arc with smooth curve */}
//       <line>
//         <bufferGeometry attach="geometry">
//           <float32BufferAttribute 
//             attach="attributes-position" 
//             args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} 
//           />
//         </bufferGeometry>
//         <lineBasicMaterial color="#2196F3" linewidth={2} />
//       </line>

//       {/* Radius lines */}
//       <line>
//         <bufferGeometry attach="geometry">
//           <float32BufferAttribute 
//             attach="attributes-position" 
//             args={[new Float32Array([0,0,0, radius * Math.cos(startAngle), 0, radius * Math.sin(startAngle)]), 3]} 
//           />
//         </bufferGeometry>
//         <lineDashedMaterial color="#666666" dashSize={0.2} gapSize={0.1} />
//       </line>
      
//       <line>
//         <bufferGeometry attach="geometry">
//           <float32BufferAttribute 
//             attach="attributes-position" 
//             args={[new Float32Array([0,0,0, radius * Math.cos(endAngle), 0, radius * Math.sin(endAngle)]), 3]} 
//           />
//         </bufferGeometry>
//         <lineDashedMaterial color="#666666" dashSize={0.2} gapSize={0.1} />
//       </line>

//       {/* Labels */}
//       {!isTemporary && (
//         <>
//           {/* Angle measurement */}
//           <Html position={labelPosition}>
//             <div style={{
//               background: 'rgba(0, 0, 0, 0.8)',
//               color: 'white',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               whiteSpace: 'nowrap',
//               userSelect: 'none',
//               fontFamily: 'Arial'
//             }}>
//               {angleDegrees}°
//             </div>
//           </Html>

//           {/* Radius measurement */}
//           <Html position={[radius/2, 0.1, 0]}>
//             <div style={{
//               background: 'rgba(0, 0, 0, 0.8)',
//               color: 'white',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               whiteSpace: 'nowrap',
//               userSelect: 'none',
//               fontFamily: 'Arial'
//             }}>
//               R: {radius.toFixed(2)}m
//             </div>
//           </Html>

//           {/* Arc length */}
//           <Html position={[
//             radius * 1.2 * Math.cos(midAngle),
//             0.1,
//             radius * 1.2 * Math.sin(midAngle)
//           ]}>
//             <div style={{
//               background: 'rgba(0, 0, 0, 0.8)',
//               color: 'white',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               whiteSpace: 'nowrap',
//               userSelect: 'none',
//               fontFamily: 'Arial'
//             }}>
//               L: {arcLength}m
//             </div>
//           </Html>
//         </>
//       )}
//     </group>
//   );
// };

// export default ArcComponent;


import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
const ArcComponent = ({ position, radius, startAngle, endAngle, isTemporary }) => {
  // Function to normalize angles to 0-360 range
  const normalizeAngle = (angle) => {
    // Convert from radians to degrees
    let degrees = (angle * 180 / Math.PI) % 360;
    
    // Handle negative angles
    if (degrees < 0) {
      degrees += 360;
    }
    
    return degrees;
  };

  // Function to calculate the smallest angle between two angles
  const getSmallestAngle = (start, end) => {
    const normStart = normalizeAngle(start);
    const normEnd = normalizeAngle(end);
    
    let angleDiff = normEnd - normStart;
    
    // Ensure we're getting the smallest angle
    if (Math.abs(angleDiff) > 180) {
      angleDiff = angleDiff - Math.sign(angleDiff) * 360;
    }
    
    return angleDiff;
  };

  // Calculate the displayed angle
  const displayAngle = getSmallestAngle(startAngle, endAngle);

  // Create points for the arc with more segments for smoother curves
  const segments = 100;
  const points = [];
  const angleStep = (endAngle - startAngle) / segments;

  // Generate points for smoother arc
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (i * angleStep);
    points.push(new THREE.Vector3(
      radius * Math.cos(angle),
      0,
      radius * Math.sin(angle)
    ));
  }

  const arcLength = (radius * Math.abs(endAngle - startAngle)).toFixed(2);
  const midAngle = (startAngle + endAngle) / 2;
  const labelRadius = radius * 0.7;
  const labelPosition = [
    labelRadius * Math.cos(midAngle),
    0.1,
    labelRadius * Math.sin(midAngle)
  ];

  return (
    <group position={position}>
      {/* Main arc with smooth curve */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute 
            attach="attributes-position" 
            args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} 
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2196F3" linewidth={2} />
      </line>

      {/* Radius lines */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute 
            attach="attributes-position" 
            args={[new Float32Array([0,0,0, radius * Math.cos(startAngle), 0, radius * Math.sin(startAngle)]), 3]} 
          />
        </bufferGeometry>
        <lineDashedMaterial color="#666666" dashSize={0.2} gapSize={0.1} />
      </line>
      
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute 
            attach="attributes-position" 
            args={[new Float32Array([0,0,0, radius * Math.cos(endAngle), 0, radius * Math.sin(endAngle)]), 3]} 
          />
        </bufferGeometry>
        <lineDashedMaterial color="#666666" dashSize={0.2} gapSize={0.1} />
      </line>

      {/* Labels */}
      {!isTemporary && (
        <>
          {/* Angle measurement */}
          <Html position={labelPosition}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontFamily: 'Arial'
            }}>
              {Math.abs(displayAngle).toFixed(1)}°
            </div>
          </Html>

          {/* Radius measurement */}
          <Html position={[radius/2, 0.1, 0]}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontFamily: 'Arial'
            }}>
              R: {radius.toFixed(2)}m
            </div>
          </Html>

          {/* Arc length */}
          <Html position={[
            radius * 1.2 * Math.cos(midAngle),
            0.1,
            radius * 1.2 * Math.sin(midAngle)
          ]}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontFamily: 'Arial'
            }}>
              L: {arcLength}m
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

export default ArcComponent;