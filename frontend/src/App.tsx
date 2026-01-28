import './App.css'
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
        axios.get("/api/testing")
            .then((res) => {
                console.log("Response from backend:", res.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    }, []);
  return (
    <div>
      Hello guys!!
    </div>
  )
}

export default App
