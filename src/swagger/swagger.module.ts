import { DynamicModule, INestApplication, Module } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

@Module({

})
export class SwaggerModuleLocal {
    static forRoot(app: INestApplication): DynamicModule {
        const swaggerConfig = new DocumentBuilder()
        .setTitle("Brick test task API")
        .setDescription("Documentation brick test task API")
        .setVersion(process.env.API_VERSION)
        .addBearerAuth({
            type: "http",
            bearerFormat: "JWT",
            in: "header",
            scheme: "bearer",
            name: "JWT",
            description: "Enter your access jwt token",
          }).addCookieAuth(process.env.REFRESH_TOKEN_COOKIE_NAME, {
            type: "apiKey",
            in: "cookie",
            description: "Enter your cookie refresh jwt token",
            name: process.env.REFRESH_TOKEN_COOKIE_NAME
          }).build()
        const document = SwaggerModule.createDocument(app, swaggerConfig)
        SwaggerModule.setup("/swagger", app, document)

        return {
            module: SwaggerModuleLocal
        }
    }
}