import { Wheel } from '@uiw/react-color';
import React, { useState } from 'react';

function App() {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 })
  return (
    <div className="App">
      <Wheel
        color={hsva}
        onChange={(color) => {
          setHsva({ ...hsva, ...color.hsva });
        }}
      />
    </div>
  );
}

export default App;
