import React from 'react';

import { FileIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { extractFileExtension } from '@/utils/file';

export type EditorFileIconProps = {
  filename: string;
};

export const EditorFileIcon = ({ filename }: EditorFileIconProps) => {
  return (
    <div className="h-auto w-4 fill-sky-700">
      {match(extractFileExtension(filename))
        .with('.css', () => (
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="29.18 4 25.61 22.36 25.28 24 20.54 25.57 17.26 26.66 13.21 28 2.87 24.05 4.05 18 8.25 18 7.81 20.85 14.15 23.27 14.93 23.01 21.45 20.85 21.62 20.02 22.41 16 4.44 16 5.18 12.24 5.23 12 23.19 12 23.97 8 6 8 6.78 4 29.18 4"
              style={{ fill: '#42a5f5' }}
            />
          </svg>
        ))
        .with('.js', () => (
          <svg height="16" version="1.1" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m2 2h12v12h-12v-12m3.1533 10.027c0.26667 0.56667 0.79333 1.0333 1.6933 1.0333 1 0 1.6867-0.53333 1.6867-1.7v-3.8533h-1.1333v3.8267c0 0.57333-0.23333 0.72-0.6 0.72-0.38667 0-0.54667-0.26667-0.72667-0.58l-0.92 0.55333m3.9867-0.12c0.33333 0.65333 1.0067 1.1533 2.06 1.1533 1.0667 0 1.8667-0.55333 1.8667-1.5733 0-0.94-0.54-1.36-1.5-1.7733l-0.28-0.12c-0.48667-0.20667-0.69333-0.34667-0.69333-0.68 0-0.27333 0.20667-0.48667 0.54-0.48667 0.32 0 0.53333 0.14 0.72667 0.48667l0.87333-0.58c-0.36667-0.64-0.88667-0.88667-1.6-0.88667-1.0067 0-1.6533 0.64-1.6533 1.4867 0 0.92 0.54 1.3533 1.3533 1.7l0.28 0.12c0.52 0.22667 0.82667 0.36667 0.82667 0.75333 0 0.32-0.3 0.55333-0.76667 0.55333-0.55333 0-0.87333-0.28667-1.1133-0.68667z"
              fill="#ffca28"
              strokeWidth=".66667"
            />
          </svg>
        ))
        .with('.jsx', () => (
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path
                d="M16,12c7.44405,0,12,2.58981,12,4s-4.55595,4-12,4S4,17.41019,4,16,8.556,12,16,12m0-2C8.268,10,2,12.68629,2,16s6.268,6,14,6,14-2.68629,14-6-6.268-6-14-6Z"
                style={{ fill: '#00bcd4' }}
              />
              <path d="M16,14a2,2,0,1,0,2,2,2,2,0,0,0-2-2Z" style={{ fill: '#00bcd4' }} />
              <path
                d="M10.45764,5.50706C12.47472,5.50746,16.395,8.68416,19.4641,14,23.18613,20.44672,23.22125,25.68721,22,26.3923a.90009.90009,0,0,1-.45691.10064c-2.01725,0-5.93792-3.17678-9.00721-8.49294C8.81387,11.55328,8.77875,6.31279,10,5.6077a.90278.90278,0,0,1,.45766-.10064m-.00076-2A2.87113,2.87113,0,0,0,9,3.87564C6.13025,5.5325,6.93785,12.30391,10.80385,19c3.28459,5.68906,7.71948,9.49292,10.73927,9.49292A2.87033,2.87033,0,0,0,23,28.12436C25.86975,26.4675,25.06215,19.69609,21.19615,13c-3.28459-5.68906-7.71948-9.49342-10.73927-9.49292Z"
                style={{ fill: '#00bcd4' }}
              />
              <path
                d="M21.54311,5.50706A.9.9,0,0,1,22,5.6077c1.22125.70509,1.18613,5.94558-2.5359,12.3923-3.06929,5.31616-6.99,8.49294-9.00721,8.49294A.9.9,0,0,1,10,26.3923C8.77875,25.68721,8.81387,20.44672,12.5359,14c3.06929-5.31616,6.99-8.49294,9.00721-8.49294m0-2c-3.01979,0-7.45468,3.80386-10.73927,9.49292C6.93785,19.69609,6.13025,26.4675,9,28.12436a2.87033,2.87033,0,0,0,1.45688.36856c3.01979,0,7.45468-3.80386,10.73927-9.49292C25.06215,12.30391,25.86975,5.5325,23,3.87564a2.87033,2.87033,0,0,0-1.45688-.36856Z"
                style={{ fill: '#00bcd4' }}
              />
            </g>
          </svg>
        ))
        .with('.ts', () => (
          <svg height="16" version="1.1" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m2 2h12v12h-12v-12m7.14 9.9067c0.33333 0.65333 1.0067 1.1533 2.06 1.1533 1.0667 0 1.8667-0.55333 1.8667-1.5733 0-0.94-0.54-1.36-1.5-1.7733l-0.28-0.12c-0.48667-0.20667-0.69333-0.34667-0.69333-0.68 0-0.27333 0.20667-0.48667 0.54-0.48667 0.32 0 0.53333 0.14 0.72667 0.48667l0.87333-0.58c-0.36667-0.64-0.88667-0.88667-1.6-0.88667-1.0067 0-1.6533 0.64-1.6533 1.4867 0 0.92 0.54 1.3533 1.3533 1.7l0.28 0.12c0.52 0.22667 0.82667 0.36667 0.82667 0.75333 0 0.32-0.3 0.55333-0.76667 0.55333-0.55333 0-0.87333-0.28667-1.1133-0.68667l-0.92 0.53333m-0.47333-4.4067h-3.3333v1h1v4.8333h1.1667v-4.8333h1.1667z"
              fill="#0288d1"
              strokeWidth=".66667"
            />
          </svg>
        ))
        .with('.tsx', () => (
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path
                d="M16,12c7.44405,0,12,2.58981,12,4s-4.55595,4-12,4S4,17.41019,4,16,8.556,12,16,12m0-2C8.268,10,2,12.68629,2,16s6.268,6,14,6,14-2.68629,14-6-6.268-6-14-6Z"
                style={{ fill: '#0288d1' }}
              />
              <path d="M16,14a2,2,0,1,0,2,2,2,2,0,0,0-2-2Z" style={{ fill: '#0288d1' }} />
              <path
                d="M10.45764,5.50706C12.47472,5.50746,16.395,8.68416,19.4641,14,23.18613,20.44672,23.22125,25.68721,22,26.3923a.90009.90009,0,0,1-.45691.10064c-2.01725,0-5.93792-3.17678-9.00721-8.49294C8.81387,11.55328,8.77875,6.31279,10,5.6077a.90278.90278,0,0,1,.45766-.10064m-.00076-2A2.87113,2.87113,0,0,0,9,3.87564C6.13025,5.5325,6.93785,12.30391,10.80385,19c3.28459,5.68906,7.71948,9.49292,10.73927,9.49292A2.87033,2.87033,0,0,0,23,28.12436C25.86975,26.4675,25.06215,19.69609,21.19615,13c-3.28459-5.68906-7.71948-9.49342-10.73927-9.49292Z"
                style={{ fill: '#0288d1' }}
              />
              <path
                d="M21.54311,5.50706A.9.9,0,0,1,22,5.6077c1.22125.70509,1.18613,5.94558-2.5359,12.3923-3.06929,5.31616-6.99,8.49294-9.00721,8.49294A.9.9,0,0,1,10,26.3923C8.77875,25.68721,8.81387,20.44672,12.5359,14c3.06929-5.31616,6.99-8.49294,9.00721-8.49294m0-2c-3.01979,0-7.45468,3.80386-10.73927,9.49292C6.93785,19.69609,6.13025,26.4675,9,28.12436a2.87033,2.87033,0,0,0,1.45688.36856c3.01979,0,7.45468-3.80386,10.73927-9.49292C25.06215,12.30391,25.86975,5.5325,23,3.87564a2.87033,2.87033,0,0,0-1.45688-.36856Z"
                style={{ fill: '#0288d1' }}
              />
            </g>
          </svg>
        ))
        .otherwise(() => (
          <FileIcon />
        ))}
    </div>
  );
};
