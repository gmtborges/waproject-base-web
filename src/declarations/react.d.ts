import 'react';

declare module 'React' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Attributes {
    innerRef?: any;
  }
}