import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        let message = [];
        errors.map((error) => {
          const constraints = error.constraints || {};
          message.push(...Object.values(constraints));
        });
        return new HttpException(message.join(';'), HttpStatus.BAD_REQUEST);
      },
    });
  }
}
