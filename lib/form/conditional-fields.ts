/**
 * Utilities for handling conditional form fields
 */

/**
 * Represents a condition for showing/hiding a field
 */
export interface FieldCondition {
  /**
   * The field this condition applies to
   */
  field: string

  /**
   * Function to determine if the field should be visible
   * @param values - The current form values
   * @returns True if the field should be visible, false otherwise
   */
  isVisible: (values: Record<string, string>) => boolean

  /**
   * Whether to clear the field value when hidden
   * @default true
   */
  clearWhenHidden?: boolean
}

/**
 * Determines which fields should be visible based on conditions
 * @param values - Current form values
 * @param conditions - Array of field conditions
 * @returns Object mapping field names to visibility status
 */
export function evaluateFieldVisibility(
  values: Record<string, string>,
  conditions: FieldCondition[],
): Record<string, boolean> {
  const visibility: Record<string, boolean> = {}

  for (const condition of conditions) {
    visibility[condition.field] = condition.isVisible(values)
  }

  return visibility
}

/**
 * Clears values of hidden fields if specified in their conditions
 * @param values - Current form values
 * @param visibility - Object mapping field names to visibility status
 * @param conditions - Array of field conditions
 * @returns Updated form values with hidden fields cleared if needed
 */
export function clearHiddenFields(
  values: Record<string, string>,
  visibility: Record<string, boolean>,
  conditions: FieldCondition[],
): Record<string, string> {
  const updatedValues = { ...values }

  for (const condition of conditions) {
    const { field, clearWhenHidden = true } = condition

    if (!visibility[field] && clearWhenHidden && updatedValues[field]) {
      updatedValues[field] = ""
    }
  }

  return updatedValues
}

/**
 * Creates a validation function that only validates visible fields
 * @param baseValidator - The original validation function
 * @param visibility - Object mapping field names to visibility status
 * @returns A validation function that only validates visible fields
 */
export function createConditionalValidator(
  baseValidator: (values: Record<string, string>) => Record<string, string>,
  visibility: Record<string, boolean>,
): (values: Record<string, string>) => Record<string, string> {
  return (values: Record<string, string>) => {
    const allErrors = baseValidator(values)
    const visibleErrors: Record<string, string> = {}

    // Only keep errors for visible fields
    Object.keys(allErrors).forEach((field) => {
      if (visibility[field] !== false) {
        visibleErrors[field] = allErrors[field]
      }
    })

    return visibleErrors
  }
}

/**
 * Creates a hook for managing conditional fields
 * @param conditions - Array of field conditions
 * @returns A hook for managing conditional fields
 */
export function createConditionalFieldsHook(conditions: FieldCondition[]) {
  return function useConditionalFields(
    values: Record<string, string>,
    setValues: (values: Record<string, string>) => void,
  ) {
    /**
     * Evaluates which fields should be visible
     * @returns Object mapping field names to visibility status
     */
    const getVisibility = () => {
      return evaluateFieldVisibility(values, conditions)
    }

    /**
     * Updates form values, clearing hidden fields if needed
     */
    const updateValues = () => {
      const visibility = getVisibility()
      const updatedValues = clearHiddenFields(values, visibility, conditions)

      if (JSON.stringify(updatedValues) !== JSON.stringify(values)) {
        setValues(updatedValues)
      }

      return visibility
    }

    /**
     * Creates a conditional validator
     * @param baseValidator - The original validation function
     * @returns A validation function that only validates visible fields
     */
    const createValidator = (baseValidator: (values: Record<string, string>) => Record<string, string>) => {
      const visibility = getVisibility()
      return createConditionalValidator(baseValidator, visibility)
    }

    return {
      getVisibility,
      updateValues,
      createValidator,
    }
  }
}

/**
 * Hook for using conditional fields with a form
 * @param values - Current form values
 * @param setValues - Function to update form values
 * @param conditions - Array of field conditions
 * @returns Object with visibility status and utility functions
 */
export function useConditionalFields(
  values: Record<string, string>,
  setValues: (values: Record<string, string>) => void,
  conditions: FieldCondition[],
) {
  /**
   * Determines which fields should be visible
   */
  const visibility = evaluateFieldVisibility(values, conditions)

  /**
   * Updates form values, clearing hidden fields if needed
   */
  const updateValues = () => {
    const updatedValues = clearHiddenFields(values, visibility, conditions)

    if (JSON.stringify(updatedValues) !== JSON.stringify(values)) {
      setValues(updatedValues)
    }
  }

  /**
   * Checks if a specific field should be visible
   * @param field - The field to check
   * @returns True if the field should be visible, false otherwise
   */
  const isFieldVisible = (field: string) => {
    return visibility[field] !== false
  }

  /**
   * Creates a conditional validator
   * @param baseValidator - The original validation function
   * @returns A validation function that only validates visible fields
   */
  const createValidator = (baseValidator: (values: Record<string, string>) => Record<string, string>) => {
    return createConditionalValidator(baseValidator, visibility)
  }

  return {
    visibility,
    updateValues,
    isFieldVisible,
    createValidator,
  }
}
