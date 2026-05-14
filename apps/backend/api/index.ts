import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express = require('express');

const server = express();
let cachedApp: any;

export default async (req: any, res: any) => {
  try {
    if (!cachedApp) {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
      );

      app.setGlobalPrefix('api');

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );

      app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      });

      await app.init();
      cachedApp = app;
    }

    server(req, res);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('NEST_INIT_ERROR:', error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};