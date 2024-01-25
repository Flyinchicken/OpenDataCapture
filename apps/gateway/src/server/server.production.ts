import fs from 'fs/promises';
import path from 'path';

import compression from 'compression';
import sirv from 'sirv';

import type { RenderFunction } from '@/entry-server';

import { BaseServer } from './server.base';
import { SERVER_CONFIG } from './server.config';

const template = await fs.readFile(path.resolve(SERVER_CONFIG.root, './dist/client/index.html'), 'utf-8');

export class ProductionServer extends BaseServer {
  constructor(protected app: App) {
    super(app);
    app.use(compression());
    app.use(SERVER_CONFIG.base, sirv(path.resolve(SERVER_CONFIG.root, './dist/client'), { extensions: [] }));
  }

  protected async loadRender() {
    return import(path.resolve(SERVER_CONFIG.root, './dist/server/entry-server.js')).then((module) => {
      return (module as { render: RenderFunction }).render;
    });
  }

  protected loadTemplate() {
    return template;
  }
}
