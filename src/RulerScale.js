import React from 'react';

const styles = {
  ruler: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '48px',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',    
  },
  markContainer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  majorTick: {
    position: 'absolute',
    right: 0,
    width: '16px',
    height: '1px',
    backgroundColor: 'white'
  },
  label: {
    position: 'absolute',
    left: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 500
  },
  minorTicksContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  minorTick: {
    position: 'absolute',
    right: 0,
    width: '8px',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }
};

const RulerScale = () => {
  // Generate marks from 0m to 25m
  const marks = Array.from({ length: 26 }, (_, i) => ({
    value: i,
    label: `${i}m`
  }));

  return (
    <div style={styles.ruler}>
      <div style={styles.container}>
        {marks.map((mark) => (
          <div
            key={mark.value}
            style={{
              ...styles.markContainer,
              top: `${mark.value * (100/25)}%`,
              height: `${100/25}%`
            }}
          >
            {/* Major tick mark */}
            <div style={styles.majorTick} />
            
            {/* Label */}
            <span style={styles.label}>
              {mark.label}
            </span>
            
            {/* Minor tick marks */}
            <div style={styles.minorTicksContainer}>
              {[0.2, 0.4, 0.6, 0.8].map((fraction) => (
                <div
                  key={fraction}
                  style={{
                    ...styles.minorTick,
                    top: `${fraction * 100}%`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulerScale;