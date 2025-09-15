import jwtDecode from 'jwt-decode';
import { PayloadAccessTokenDto } from '../dtos/payload-access-token.dto';
import { Request } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodash = require('lodash');

export interface AuthMessage {
  timestamp: number
  method: string | undefined
  url: string | undefined
  data: unknown
  query: unknown
}
export const serializeMessage = (message: AuthMessage): string => {
  return JSON.stringify(
    lodash.cloneDeepWith(message, (value: unknown) => {
      return !lodash.isPlainObject(value) ? lodash.toString(value) : undefined;
    })
  );
};

export const decodeToken = (request: Request): PayloadAccessTokenDto | null => {
  const authorizationHeader = request.headers.authorization;

  // Extract the JWT token from the Authorization header
  const token: string | null = authorizationHeader ? authorizationHeader.replace('Bearer ', '') : null;

  if (token) {
    // Decode the JWT token using jwt-decode library
    const decodedToken: any = jwtDecode(token);

    // Return or manipulate the decoded token as needed
    return decodedToken as PayloadAccessTokenDto;
  }

  return null;
};
