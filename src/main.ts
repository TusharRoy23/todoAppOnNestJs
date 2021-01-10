import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 3000
  app.setGlobalPrefix('api')
  console.log('Port running on: ', port)

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Todo APP')
    .setDescription('Todo API documentation')
    .setVersion('1.0')
    .addTag('Todo')
    .build()
    
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  // app.enableCors()

  // app.use(bodyParser.json({limit: '1mb'}))
  // app.use(bodyParser.urlencoded({ limit:'1mb', extended: true }))
  // app.use(bodyParser.text({type: 'text/html'}))

  await app.listen(port);
}
bootstrap();
