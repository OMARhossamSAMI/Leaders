import * as dns from 'node:dns';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const DNS_TIMEOUT_MS = 3000;
const AUTHORITATIVE_NO_RECORD_CODES = new Set<string>([
  dns.NOTFOUND,
  dns.NODATA,
]);

async function resolveWithTimeout<T>(
  fn: (resolver: dns.promises.Resolver) => Promise<T>,
): Promise<T> {
  const resolver = new dns.promises.Resolver();
  const timer = setTimeout(() => resolver.cancel(), DNS_TIMEOUT_MS);
  try {
    return await fn(resolver);
  } finally {
    clearTimeout(timer);
  }
}

@ValidatorConstraint({ name: 'IsEmailDomainReachable', async: true })
export class IsEmailDomainReachableConstraint
  implements ValidatorConstraintInterface
{
  async validate(email: unknown): Promise<boolean> {
    if (typeof email !== 'string') return false;
    const domain = email.trim().toLowerCase().split('@')[1];
    if (!domain) return false;

    let mxAuthoritative = false;
    try {
      const mx = await resolveWithTimeout((r) => r.resolveMx(domain));
      if (mx.length > 0) return true;
      mxAuthoritative = true; // empty array is unusual but treat like NODATA
    } catch (err: any) {
      mxAuthoritative = AUTHORITATIVE_NO_RECORD_CODES.has(err?.code);
    }

    try {
      await resolveWithTimeout((r) => r.resolve4(domain)); // RFC 5321 fallback
      return true;
    } catch (err: any) {
      const aAuthoritative = AUTHORITATIVE_NO_RECORD_CODES.has(err?.code);
      // Reject only when BOTH lookups authoritatively found nothing.
      // Any transient/unknown failure on either leg fails OPEN.
      return !(mxAuthoritative && aAuthoritative);
    }
  }

  defaultMessage(): string {
    return 'Please enter an email address that can receive mail.';
  }
}

export function IsEmailDomainReachable(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsEmailDomainReachableConstraint,
    });
  };
}
