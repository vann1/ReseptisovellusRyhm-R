import React from 'react';

const OrangeComponent = () => {
  return (
    <div style={{ backgroundColor: '#D95100', padding: '20px', color: '#fff' }}>
      <h2>Orange Component</h2>
      <p>This is an example component with an orange background.</p>
    </div>
  );
};

const YellowComponent = () => {
  return (
    <div style={{ backgroundColor: '#FFD34E', padding: '20px', color: '#000' }}>
      <h2>Yellow Component</h2>
      <p>This is an example component with a yellow background.</p>
    </div>
  );
};

const BlueComponent = () => {
  return (
    <div style={{ backgroundColor: '#04BFBF', padding: '20px', color: '#fff' }}>
      <h2>Blue Component</h2>
      <p>This is an example component with a blue background.</p>
    </div>
  );
};

const DarkBlueComponent = () => {
  return (
    <div style={{ backgroundColor: '#0D6986', padding: '20px', color: '#fff' }}>
      <h2>Dark Blue Component</h2>
      <p>This is an example component with a dark blue background.</p>
    </div>
  );
};

export { OrangeComponent, YellowComponent, BlueComponent, DarkBlueComponent };
