declare module 'ssr-react' {
    import React from 'react';
    export = React;
}

declare module 'ssr-react-dom' {
    import ReactDOM from 'react-dom';
    export = ReactDOM;
}

declare module 'ssr-react-dom/client' {
    export * from 'react-dom/client';
}

declare module 'ssr-react-dom/server' {
    export * from 'react-dom/server';
}
