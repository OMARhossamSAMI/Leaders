import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const REPEATED_CHAR_RUN = /(\p{L})\1{5,}/u; // 6+ identical letters in a row (digits excluded: phone/reference numbers legitimately repeat digits)
const SHORT_REPEATING_PATTERN = /^(.{1,4})\1{3,}$/; // whole message is a <=4-char unit, 4+ times
const CONSONANT_RUN = /[b-df-hj-np-tv-xz]{6,}/i; // 6+ Latin consonants in a row (y treated as a vowel)
const MIN_LENGTH_FOR_DIVERSITY_CHECK = 30; // short repeated real phrases ("no no no...") shouldn't trip this
const MIN_DISTINCT_CHARS = 5;

function hasLowCharacterDiversity(text: string): boolean {
  return (
    text.length > MIN_LENGTH_FOR_DIVERSITY_CHECK &&
    new Set(text).size < MIN_DISTINCT_CHARS
  );
}

function isLatinMajority(text: string): boolean {
  const letters = text.match(/\p{L}/gu);
  if (!letters || letters.length === 0) return false; // no letters at all -> don't run the Latin-only check
  const latinLetters = text.match(/\p{Script=Latin}/gu) ?? [];
  return latinLetters.length / letters.length > 0.5;
}

@ValidatorConstraint({ name: 'IsRealText', async: false })
export class IsRealTextConstraint implements ValidatorConstraintInterface {
  validate(text: unknown): boolean {
    if (typeof text !== 'string') return false;

    if (REPEATED_CHAR_RUN.test(text)) return false;
    if (SHORT_REPEATING_PATTERN.test(text)) return false;
    if (hasLowCharacterDiversity(text)) return false;
    if (isLatinMajority(text) && CONSONANT_RUN.test(text)) return false;

    return true;
  }

  defaultMessage(): string {
    return 'Please enter a real message.';
  }
}

export function IsRealText(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsRealTextConstraint,
    });
  };
}
