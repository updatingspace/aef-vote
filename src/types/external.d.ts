declare module 'prop-types' {
  const content: any;
  export default content;
}

declare module '../components/account/*' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
