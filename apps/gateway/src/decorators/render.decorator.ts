/* eslint-disable @typescript-eslint/no-explicit-any */

import { Header } from '@nestjs/common';

const setHeader = Header('Content-Type', 'text/html');

export const COMPONENT_KEY = 'COMPONENT';

export const Render = <
  T extends object,
  K extends Extract<keyof T, string>,
  P extends T[K] extends (...args: any[]) => infer R ? R : never
>(
  component: React.FC<P>
) => {
  return (target: T, propertyKey: K, descriptor: PropertyDescriptor) => {
    setHeader(target, propertyKey, descriptor);
    Reflect.defineMetadata(COMPONENT_KEY, component, target[propertyKey] as object);
  };
};
