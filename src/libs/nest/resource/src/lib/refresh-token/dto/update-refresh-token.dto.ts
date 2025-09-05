import { PartialType } from '@nestjs/swagger';
import { CreateRefreshTokenDTO } from './create-refresh-token.dto';

export class UpdateRefreshTokenDTO extends PartialType(CreateRefreshTokenDTO) {}
