import type { RequestHandler } from 'express';

import { CONFIG } from '@/config';
import { generateToken } from '@/utils/auth';
import { HttpException } from '@/utils/http-exception';

export const apiKeyMiddleware: RequestHandler = (req, _, next) => {
  const key = req.headers.authorization?.match(/^Bearer (.+)$/i)?.at(1);
  if (key !== CONFIG.apiKey) {
    const assignmentId = req.originalUrl.match(/\/api\/assignments\/(.*)/)?.at(1);
    const isAssignmentUpdate = assignmentId && req.method === 'PATCH';
    if (!isAssignmentUpdate) {
      throw new HttpException(401, 'Unauthorized');
    }
    const validToken = generateToken(assignmentId);
    if (key !== validToken) {
      throw new HttpException(401, 'Unauthorized');
    }
  }
  next();
};
