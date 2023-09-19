import * as React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from "./Landing";
import NonVoice from "./NonVoice";
import Voice from "./Voice";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}></Route>
          <Route path="/nonvoice" element={<NonVoice/>}></Route>
          <Route path="/voice" element={<Voice/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
