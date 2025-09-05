import { Controller } from '@nestjs/common';
import { routePrefix } from '../config';

@Controller(`${routePrefix}`)
export class CommunicationController {}
