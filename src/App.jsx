import { useState } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import NavigationBar from "./components/NavigationBar.jsx";


function App() {
    const [count, setCount] = useState(0);

    return (
        <Router>
            <div>
                <NavigationBar />


            </div>
        </Router>
    );
}

export default App;
