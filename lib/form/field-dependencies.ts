/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/**
 * Utilities for handling form field dependencies
 */

/**
 * Represents a dependency between form fields
 */
export interface FieldDependency {
  /**
   * The field that depends on other fields
   */
  field: string

  /**
   * The fields this field depends on
   */
  dependsOn: string[]

  /**
   * Function to determine the value of the dependent field
   * @param values - The current form values
   * @param currentValue - The current value of the dependent field
   * @returns The new value for the dependent field
   */
  getValue: (values: Record<string, string>, currentValue: string) => string
}

/**
 * Represents a validation dependency between form fields
 */
export interface ValidationDependency {
  /**
   * The field to validate
   */
  field: string

  /**
   * The fields this validation depends on
   */
  dependsOn: string[]

  /**
   * Function to validate the field based on dependencies
   * @param value - The value of the field to validate
   * @param values - All form values
   * @returns Validation error message or undefined if valid
   */
  validate: (value: string, values: Record<string, string>) => string | undefined
}

/**
 * Updates dependent field values based on defined dependencies
 * @param values - Current form values
 * @param dependencies - Array of field dependencies
 * @returns Updated form values with resolved dependencies
 */
export function resolveDependencies(
  values: Record<string, string>,
  dependencies: FieldDependency[],
): Record<string, string> {
  const updatedValues = { ...values }
  let hasChanges = true
  let iterations = 0
  const maxIterations = dependencies.length * 2 // Prevent infinite loops

  // Continue resolving dependencies until no more changes are made
  // or maximum iterations reached (to prevent circular dependencies)
  while (hasChanges && iterations < maxIterations) {
    hasChanges = false
    iterations++

    for (const dependency of dependencies) {
      const { field, dependsOn, getValue } = dependency

      // Check if all dependencies have values
      const allDependenciesHaveValues = dependsOn.every((dep) => updatedValues[dep] !== undefined)

      if (allDependenciesHaveValues) {
        const currentValue = updatedValues[field] || ""
        const newValue = getValue(updatedValues, currentValue)

        if (newValue !== currentValue) {
          updatedValues[field] = newValue
          hasChanges = true
        }
      }
    }
  }

  return updatedValues
}

/**
 * Validates fields with dependencies
 * @param values - Current form values
 * @param dependencies - Array of validation dependencies
 * @returns Object containing validation errors
 */
export function validateDependentFields(
  values: Record<string, string>,
  dependencies: ValidationDependency[],
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const dependency of dependencies) {
    const { field, dependsOn, validate } = dependency

    // Check if all dependencies have values
    const allDependenciesHaveValues = dependsOn.every((dep) => values[dep] !== undefined)

    if (allDependenciesHaveValues) {
      const value = values[field] || ""
      const error = validate(value, values)

      if (error) {
        errors[field] = error
      }
    }
  }

  return errors
}

/**
 * Creates a dependency chain between fields
 * @param dependencies - Array of field dependencies
 * @returns A dependency graph showing relationships between fields
 */
export function createDependencyGraph(dependencies: FieldDependency[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {}

  for (const dependency of dependencies) {
    const { field, dependsOn } = dependency

    // Initialize arrays if they don't exist
    if (!graph[field]) {
      graph[field] = []
    }

    for (const dep of dependsOn) {
      if (!graph[dep]) {
        graph[dep] = []
      }

      // Add the dependent field to the dependency's dependents list
      if (!graph[dep].includes(field)) {
        graph[dep].push(field)
      }
    }
  }

  return graph
}

/**
 * Determines which fields need to be updated when a specific field changes
 * @param field - The field that changed
 * @param dependencyGraph - The dependency graph
 * @returns Array of fields that need to be updated
 */
export function getAffectedFields(field: string, dependencyGraph: Record<string, string[]>): string[] {
  const affected: string[] = []
  const visited = new Set<string>()

  function traverse(currentField: string) {
    if (visited.has(currentField)) return
    visited.add(currentField)

    const dependents = dependencyGraph[currentField] || []

    for (const dependent of dependents) {
      affected.push(dependent)
      traverse(dependent)
    }
  }

  traverse(field)
  return affected
}
