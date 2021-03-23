import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './shared/adapters/socket-io-3.adapter';

const APP_PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const whitelist = ['http://localhost:3000'];
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.enableCors({
    // origin: function (origin, callback) {
    //   console.log('!!!!', origin);
    //   if (whitelist.indexOf(origin) !== -1) {
    //     console.log('allowed cors for:', origin);
    //     callback(null, true);
    //   } else {
    //     console.log('blocked cors for:', origin);
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  await app.listen(APP_PORT);
}
bootstrap();
