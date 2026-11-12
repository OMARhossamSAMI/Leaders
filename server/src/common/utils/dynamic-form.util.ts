export interface DynamicFieldDefinition {
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface ValidateDynamicFormOptions {
  /** field_names to skip entirely — e.g. fields the frontend conditionally omits. */
  skipFieldNames?: string[];
  /**
   * For 'file'-type fields: was a file actually attached, keyed by field_name?
   * Omit entirely when file-to-field association can't be reconstructed —
   * required-checks for type:'file' fields are then skipped rather than guessed at.
   */
  filePresenceByField?: Record<string, boolean>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

export function validateDynamicFormSubmission(
  submitted: Record<string, any>,
  fields: DynamicFieldDefinition[],
  options: ValidateDynamicFormOptions = {},
): string[] {
  const { skipFieldNames = [], filePresenceByField } = options;
  const errors: string[] = [];

  for (const field of fields) {
    if (skipFieldNames.includes(field.field_name)) continue;

    if (field.type === 'file') {
      if (
        field.required &&
        filePresenceByField &&
        !filePresenceByField[field.field_name]
      ) {
        errors.push(`${field.label} is required.`);
      }
      continue;
    }

    const value = submitted[field.field_name];
    const isEmpty =
      value === undefined || value === null || String(value).trim() === '';

    if (field.required && isEmpty) {
      errors.push(`${field.label} is required.`);
      continue;
    }
    if (isEmpty) continue;

    switch (field.type) {
      case 'email':
        if (!EMAIL_RE.test(String(value))) {
          errors.push(`Please enter a valid email address for ${field.label}.`);
        }
        break;
      case 'tel':
        if (!PHONE_RE.test(String(value))) {
          errors.push(`Please enter a valid phone number for ${field.label}.`);
        }
        break;
      case 'date':
        if (Number.isNaN(Date.parse(String(value)))) {
          errors.push(`Please enter a valid date for ${field.label}.`);
        }
        break;
      case 'number':
        if (Number.isNaN(Number(value))) {
          errors.push(`Please enter a valid number for ${field.label}.`);
        }
        break;
      case 'select':
      case 'radio':
        if (field.options?.length && !field.options.includes(String(value))) {
          errors.push(`Please choose a valid option for ${field.label}.`);
        }
        break;
    }
  }

  return errors;
}
