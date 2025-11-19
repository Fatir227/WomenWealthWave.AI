/// <reference types="vite/client" />

// For CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// For image imports
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// For CSS
// declare module '*.css';

// For SCSS
// declare module '*.scss';

// For LESS
// declare module '*.less';

// For Stylus
// declare module '*.styl';

// For JSON
// declare module '*.json';
