import { Suspense } from 'react';
import { Preloader } from '@src/components/preloader'; // Ajusta la ruta si es necesario

export const SuspenseLoader = ({ children }) => (
    <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Preloader />
        </div>
    }>
        {children}
    </Suspense>
);