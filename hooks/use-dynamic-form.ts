"use client"
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

import type React from "react"

import { useCallback, useEffect, useMemo } from "react"
import type { FieldDependency, ValidationDependency } from "../lib/form/field-dependencies"
import type { FieldCondition } from "../lib/form/conditional-fields"
import {
  resolveDependencies,
  validateDependentFields,
  createDependencyGraph,
  getAffectedFields,
} from "../lib/form/field-dependencies"
import { evaluateFieldVisibility, clearHiddenFields, createConditionalValidator } from "../lib/form/conditional-fields"
import type { UseFormOptions } from "./use-form"
import { useForm } from "./use-form"

export interface UseDynamicFormOptions extends UseFormOptions {
  /**
   * Field dependencies configuration
   */
  dependencies?: FieldDependency[]

  /**
   * Validation dependencies configuration
   */
  validationDependencies?: ValidationDependency[]

  /**
   * Conditional fields configuration
   */
  conditions?: FieldCondition[]
}

/**
 * Hook for managing dynamic forms with field dependencies and conditional fields
 */
export function useDynamicForm({
  dependencies = [],
  validationDependencies = [],
  conditions = [],
  ...formOptions
}: UseDynamicFormOptions = {}) {
  // Initialize the base form
  const form = useForm(formOptions)

  // Create dependency graph
  const dependencyGraph = useMemo(() => {
    return createDependencyGraph(dependencies)
  }, [dependencies])

  // Handle field dependencies
  const updateDependentFields = useCallback(
    (field: string, value: string) => {
      const affectedFields = getAffectedFields(field, dependencyGraph)

      if (affectedFields.length === 0) return

      const relevantDependencies = dependencies.filter(
        (dep) => dep.field === field || affectedFields.includes(dep.field),
      )

      const updatedValues = resolveDependencies({ ...form.values, [field]: value }, relevantDependencies)

      form.setValues(updatedValues)
    },
    [form.values, form.setValues, dependencies, dependencyGraph],
  )

  // Handle conditional fields
  const { visibility, isFieldVisible } = useMemo(() => {
    const fieldVisibility = evaluateFieldVisibility(form.values, conditions)

    return {
      visibility: fieldVisibility,
      isFieldVisible: (field: string) => fieldVisibility[field] !== false,
    }
  }, [form.values, conditions])

  // Clear hidden fields when visibility changes
  useEffect(() => {
    const updatedValues = clearHiddenFields(form.values, visibility, conditions)

    if (JSON.stringify(updatedValues) !== JSON.stringify(form.values)) {
      form.setValues(updatedValues)
    }
  }, [visibility, conditions, form.values, form.setValues])

  // Enhanced change handler that updates dependent fields
  const handleChange = useCallback(
    (fieldName: string, value: string) => {
      form.handleChange(fieldName, value)
      updateDependentFields(fieldName, value)
    },
    [form.handleChange, updateDependentFields],
  )

  // Enhanced validation that includes dependencies and respects visibility
  const validateForm = useCallback(() => {
    // Get base validation results
    const baseValidation = form.validateForm()

    // Add validation from dependencies
    const dependencyErrors = validateDependentFields(form.values, validationDependencies)

    // Create conditional validator that only validates visible fields
    const conditionalValidator = createConditionalValidator(
      () => ({ ...baseValidation.errors, ...dependencyErrors }),
      visibility,
    )

    const finalErrors = conditionalValidator(form.values)
    const isValid = Object.keys(finalErrors).length === 0

    return { errors: finalErrors, isValid }
  }, [form.validateForm, form.values, validationDependencies, visibility])

  // Get props for a field with visibility check
  const getFieldProps = useCallback(
    (fieldName: string) => {
      const baseProps = form.getFieldProps(fieldName)

      return {
        ...baseProps,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          handleChange(fieldName, e.target.value)
        },
        "data-visible": isFieldVisible(fieldName) !== false,
      }
    },
    [form.getFieldProps, handleChange, isFieldVisible],
  )

  return {
    ...form,
    handleChange,
    validateForm,
    getFieldProps,
    isFieldVisible,
    visibility,
    dependencyGraph,
  }
}
