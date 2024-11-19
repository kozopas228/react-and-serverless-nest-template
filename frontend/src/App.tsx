import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/header/Header.tsx';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Header />
            <div className='container mx-auto px-4 md:px-6'>
                <Outlet />
            </div>
        </>
    );
}

export default App;
