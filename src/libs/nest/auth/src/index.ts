export * from './lib/auth.module';

// dto
export * from './lib/dto/login.dto';
export * from './lib/dto/register.dto';
export * from './lib/dto/request-reset-password.dto';
export * from './lib/dto/reset-password.dto';
export * from './lib/dto/update-profile.dto';
export * from './lib/dto/user/create-user.dto';
export * from './lib/dto/user/query-user.dto';
export * from './lib/dto/user/update-user.dto';

// errors
export * from './lib/errors/existing-user.error';
export * from './lib/errors/invalid-credentials.error';
export * from './lib/errors/unauthorized.error';
export * from './lib/errors/user-lockout.error';
export * from './lib/errors/weak-password.error';
export * from './lib/errors/no-user.error';

// guards
export * from './lib/guards/auth.guard';
export * from './lib/guards/gcloud-auth.guard';

// services
export * from './lib/services/auth.service';
export * from './lib/services/token.service';
export * from './lib/services/user.service';

// types
export * from './lib/types/auth-response.type';
export * from './lib/types/fastify-request-with-user.type';
export * from './lib/types/refresh-token-payload.type';
export * from './lib/types/user-payload.type';
export * from './lib/types/user.resource-type-mappings';

// enums
export * from './lib/enums/user-role.enum';
