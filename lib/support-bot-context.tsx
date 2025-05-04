"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define the types for our support bot
type SupportOption = {
  id: string
  label: string
  description?: string
}

type SupportNode = {
  id: string
  title: string
  message?: string
  options: SupportOption[]
  isEndpoint?: boolean
  endpointMessage?: string
}

// Define the initial support tree structure
const supportTree: Record<string, SupportNode> = {
  root: {
    id: "root",
    title: "How can we help you today?",
    message: "Please select one of the following options:",
    options: [
      {
        id: "booking",
        label: "Booking & Scheduling",
        description: "Help with making or changing appointments",
      },
      {
        id: "services",
        label: "Service Questions",
        description: "Information about our cleaning services",
      },
      {
        id: "billing",
        label: "Billing & Payments",
        description: "Questions about invoices or payment methods",
      },
      {
        id: "technical",
        label: "Technical Support",
        description: "Help with our website or mobile app",
      },
      {
        id: "accessibility",
        label: "Accessibility Support",
        description: "Help with accessibility features and settings",
      },
      {
        id: "other",
        label: "Other Inquiries",
        description: "Any other questions you might have",
      },
    ],
  },

  // Booking & Scheduling branch
  booking: {
    id: "booking",
    title: "Booking & Scheduling Support",
    message: "What do you need help with?",
    options: [
      { id: "booking-new", label: "Make a new booking" },
      { id: "booking-modify", label: "Modify existing booking" },
      { id: "booking-cancel", label: "Cancel a booking" },
      { id: "booking-recurring", label: "Set up recurring service" },
      { id: "booking-availability", label: "Check availability" },
      { id: "booking-back", label: "Back to main menu" },
    ],
  },

  "booking-new": {
    id: "booking-new",
    title: "Make a New Booking",
    message: "What type of cleaning service do you need?",
    options: [
      { id: "booking-new-regular", label: "Regular cleaning" },
      { id: "booking-new-deep", label: "Deep cleaning" },
      { id: "booking-new-move", label: "Move-in/out cleaning" },
      { id: "booking-new-office", label: "Office cleaning" },
      { id: "booking-new-custom", label: "Custom cleaning needs" },
      { id: "booking", label: "Back to booking options" },
    ],
  },

  "booking-new-regular": {
    id: "booking-new-regular",
    title: "Regular Cleaning Booking",
    isEndpoint: true,
    endpointMessage: "Connecting you with our booking team to schedule your regular cleaning service.",
    options: [{ id: "booking-new", label: "Back to service selection" }],
  },

  "booking-new-deep": {
    id: "booking-new-deep",
    title: "Deep Cleaning Booking",
    isEndpoint: true,
    endpointMessage: "Connecting you with our booking team to schedule your deep cleaning service.",
    options: [{ id: "booking-new", label: "Back to service selection" }],
  },

  "booking-new-move": {
    id: "booking-new-move",
    title: "Move-in/out Cleaning Booking",
    isEndpoint: true,
    endpointMessage: "Connecting you with our booking team to schedule your move-in/out cleaning service.",
    options: [{ id: "booking-new", label: "Back to service selection" }],
  },

  "booking-new-office": {
    id: "booking-new-office",
    title: "Office Cleaning Booking",
    isEndpoint: true,
    endpointMessage: "Connecting you with our booking team to schedule your office cleaning service.",
    options: [{ id: "booking-new", label: "Back to service selection" }],
  },

  "booking-new-custom": {
    id: "booking-new-custom",
    title: "Custom Cleaning Booking",
    isEndpoint: true,
    endpointMessage: "Connecting you with our booking team to discuss your custom cleaning needs.",
    options: [{ id: "booking-new", label: "Back to service selection" }],
  },

  "booking-modify": {
    id: "booking-modify",
    title: "Modify Existing Booking",
    message: "What would you like to change?",
    options: [
      { id: "booking-modify-date", label: "Change date or time" },
      { id: "booking-modify-service", label: "Change service type" },
      { id: "booking-modify-address", label: "Change address" },
      { id: "booking-modify-add", label: "Add extra services" },
      { id: "booking-modify-remove", label: "Remove services" },
      { id: "booking", label: "Back to booking options" },
    ],
  },

  "booking-modify-date": {
    id: "booking-modify-date",
    title: "Change Booking Date/Time",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our scheduling team. A specialist will help you change your appointment time.",
    options: [{ id: "booking-modify", label: "Back to modification options" }],
  },

  "booking-modify-service": {
    id: "booking-modify-service",
    title: "Change Service Type",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our service team. A specialist will help you change your service type.",
    options: [{ id: "booking-modify", label: "Back to modification options" }],
  },

  "booking-modify-address": {
    id: "booking-modify-address",
    title: "Change Service Address",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our booking team. A specialist will help you update your service address.",
    options: [{ id: "booking-modify", label: "Back to modification options" }],
  },

  "booking-modify-add": {
    id: "booking-modify-add",
    title: "Add Extra Services",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service team. A specialist will help you add extra services to your booking.",
    options: [{ id: "booking-modify", label: "Back to modification options" }],
  },

  "booking-modify-remove": {
    id: "booking-modify-remove",
    title: "Remove Services",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service team. A specialist will help you remove services from your booking.",
    options: [{ id: "booking-modify", label: "Back to modification options" }],
  },

  "booking-cancel": {
    id: "booking-cancel",
    title: "Cancel a Booking",
    message: "Please select your cancellation reason:",
    options: [
      { id: "booking-cancel-reschedule", label: "Need to reschedule" },
      { id: "booking-cancel-service", label: "No longer need the service" },
      { id: "booking-cancel-other", label: "Other reason" },
      { id: "booking", label: "Back to booking options" },
    ],
  },

  "booking-cancel-reschedule": {
    id: "booking-cancel-reschedule",
    title: "Cancel for Rescheduling",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our scheduling team. A specialist will help you cancel and reschedule your service.",
    options: [{ id: "booking-cancel", label: "Back to cancellation reasons" }],
  },

  "booking-cancel-service": {
    id: "booking-cancel-service",
    title: "Cancel Service",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our cancellation team. A specialist will process your cancellation request.",
    options: [{ id: "booking-cancel", label: "Back to cancellation reasons" }],
  },

  "booking-cancel-other": {
    id: "booking-cancel-other",
    title: "Cancel for Other Reason",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our customer service team. A specialist will assist with your cancellation.",
    options: [{ id: "booking-cancel", label: "Back to cancellation reasons" }],
  },

  "booking-recurring": {
    id: "booking-recurring",
    title: "Set Up Recurring Service",
    message: "How often would you like your recurring service?",
    options: [
      { id: "booking-recurring-weekly", label: "Weekly service" },
      { id: "booking-recurring-biweekly", label: "Bi-weekly service" },
      { id: "booking-recurring-monthly", label: "Monthly service" },
      { id: "booking-recurring-custom", label: "Custom schedule" },
      { id: "booking", label: "Back to booking options" },
    ],
  },

  "booking-recurring-weekly": {
    id: "booking-recurring-weekly",
    title: "Weekly Recurring Service",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our scheduling team. A specialist will set up your weekly recurring service.",
    options: [{ id: "booking-recurring", label: "Back to frequency options" }],
  },

  "booking-recurring-biweekly": {
    id: "booking-recurring-biweekly",
    title: "Bi-weekly Recurring Service",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our scheduling team. A specialist will set up your bi-weekly recurring service.",
    options: [{ id: "booking-recurring", label: "Back to frequency options" }],
  },

  "booking-recurring-monthly": {
    id: "booking-recurring-monthly",
    title: "Monthly Recurring Service",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our scheduling team. A specialist will set up your monthly recurring service.",
    options: [{ id: "booking-recurring", label: "Back to frequency options" }],
  },

  "booking-recurring-custom": {
    id: "booking-recurring-custom",
    title: "Custom Recurring Schedule",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our scheduling team. A specialist will help create your custom recurring schedule.",
    options: [{ id: "booking-recurring", label: "Back to frequency options" }],
  },

  "booking-availability": {
    id: "booking-availability",
    title: "Check Availability",
    message: "What time period are you interested in?",
    options: [
      { id: "booking-availability-today", label: "Today" },
      { id: "booking-availability-tomorrow", label: "Tomorrow" },
      { id: "booking-availability-week", label: "This week" },
      { id: "booking-availability-custom", label: "Specific date" },
      { id: "booking", label: "Back to booking options" },
    ],
  },

  "booking-availability-today": {
    id: "booking-availability-today",
    title: "Today's Availability",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our scheduling team. A specialist will check today's availability for you.",
    options: [{ id: "booking-availability", label: "Back to time period options" }],
  },

  "booking-availability-tomorrow": {
    id: "booking-availability-tomorrow",
    title: "Tomorrow's Availability",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our scheduling team. A specialist will check tomorrow's availability for you.",
    options: [{ id: "booking-availability", label: "Back to time period options" }],
  },

  "booking-availability-week": {
    id: "booking-availability-week",
    title: "This Week's Availability",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our scheduling team. A specialist will check this week's availability for you.",
    options: [{ id: "booking-availability", label: "Back to time period options" }],
  },

  "booking-availability-custom": {
    id: "booking-availability-custom",
    title: "Specific Date Availability",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our scheduling team. A specialist will check availability for your specific date.",
    options: [{ id: "booking-availability", label: "Back to time period options" }],
  },

  "booking-back": {
    id: "root",
    title: "How can we help you today?",
    message: "Please select one of the following options:",
    options: [
      { id: "booking", label: "Booking & Scheduling" },
      { id: "services", label: "Service Questions" },
      { id: "billing", label: "Billing & Payments" },
      { id: "technical", label: "Technical Support" },
      { id: "accessibility", label: "Accessibility Support" },
      { id: "other", label: "Other Inquiries" },
    ],
  },

  // Services branch
  services: {
    id: "services",
    title: "Service Questions",
    message: "What would you like to know about our services?",
    options: [
      { id: "services-types", label: "Types of cleaning services" },
      { id: "services-pricing", label: "Pricing information" },
      { id: "services-special", label: "Special requests" },
      { id: "services-products", label: "Cleaning products used" },
      { id: "services-eco", label: "Eco-friendly options" },
      { id: "services-time", label: "Service duration" },
      { id: "root", label: "Back to main menu" },
    ],
  },

  "services-types": {
    id: "services-types",
    title: "Types of Cleaning Services",
    message: "Which service are you interested in?",
    options: [
      { id: "services-types-regular", label: "Regular cleaning" },
      { id: "services-types-deep", label: "Deep cleaning" },
      { id: "services-types-move", label: "Move-in/out cleaning" },
      { id: "services-types-office", label: "Office cleaning" },
      { id: "services-types-specialty", label: "Specialty cleaning" },
      { id: "services", label: "Back to service questions" },
    ],
  },

  "services-types-regular": {
    id: "services-types-regular",
    title: "Regular Cleaning Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our regular cleaning service.",
    options: [{ id: "services-types", label: "Back to service types" }],
  },

  "services-types-deep": {
    id: "services-types-deep",
    title: "Deep Cleaning Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our deep cleaning service.",
    options: [{ id: "services-types", label: "Back to service types" }],
  },

  "services-types-move": {
    id: "services-types-move",
    title: "Move-in/out Cleaning Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our move-in/out cleaning service.",
    options: [{ id: "services-types", label: "Back to service types" }],
  },

  "services-types-office": {
    id: "services-types-office",
    title: "Office Cleaning Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our office cleaning service.",
    options: [{ id: "services-types", label: "Back to service types" }],
  },

  "services-types-specialty": {
    id: "services-types-specialty",
    title: "Specialty Cleaning Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our specialty cleaning services.",
    options: [{ id: "services-types", label: "Back to service types" }],
  },

  "services-pricing": {
    id: "services-pricing",
    title: "Pricing Information",
    message: "What pricing information are you looking for?",
    options: [
      { id: "services-pricing-regular", label: "Regular cleaning pricing" },
      { id: "services-pricing-deep", label: "Deep cleaning pricing" },
      { id: "services-pricing-move", label: "Move-in/out cleaning pricing" },
      { id: "services-pricing-office", label: "Office cleaning pricing" },
      { id: "services-pricing-custom", label: "Custom quote" },
      { id: "services", label: "Back to service questions" },
    ],
  },

  "services-pricing-regular": {
    id: "services-pricing-regular",
    title: "Regular Cleaning Pricing",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our pricing team. A specialist will provide detailed pricing for regular cleaning.",
    options: [{ id: "services-pricing", label: "Back to pricing options" }],
  },

  "services-pricing-deep": {
    id: "services-pricing-deep",
    title: "Deep Cleaning Pricing",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our pricing team. A specialist will provide detailed pricing for deep cleaning.",
    options: [{ id: "services-pricing", label: "Back to pricing options" }],
  },

  "services-pricing-move": {
    id: "services-pricing-move",
    title: "Move-in/out Cleaning Pricing",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our pricing team. A specialist will provide detailed pricing for move-in/out cleaning.",
    options: [{ id: "services-pricing", label: "Back to pricing options" }],
  },

  "services-pricing-office": {
    id: "services-pricing-office",
    title: "Office Cleaning Pricing",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our pricing team. A specialist will provide detailed pricing for office cleaning.",
    options: [{ id: "services-pricing", label: "Back to pricing options" }],
  },

  "services-pricing-custom": {
    id: "services-pricing-custom",
    title: "Custom Quote",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our pricing team. A specialist will prepare a custom quote based on your needs.",
    options: [{ id: "services-pricing", label: "Back to pricing options" }],
  },

  "services-special": {
    id: "services-special",
    title: "Special Requests",
    message: "What type of special request do you have?",
    options: [
      { id: "services-special-pets", label: "Pet-friendly cleaning" },
      { id: "services-special-allergies", label: "Allergy considerations" },
      { id: "services-special-fragrance", label: "Fragrance preferences" },
      { id: "services-special-areas", label: "Specific areas focus" },
      { id: "services-special-other", label: "Other special requests" },
      { id: "services", label: "Back to service questions" },
    ],
  },

  "services-special-pets": {
    id: "services-special-pets",
    title: "Pet-friendly Cleaning",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our custom service team. A specialist will discuss pet-friendly cleaning options.",
    options: [{ id: "services-special", label: "Back to special requests" }],
  },

  "services-special-allergies": {
    id: "services-special-allergies",
    title: "Allergy Considerations",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our custom service team. A specialist will discuss allergy-friendly cleaning options.",
    options: [{ id: "services-special", label: "Back to special requests" }],
  },

  "services-special-fragrance": {
    id: "services-special-fragrance",
    title: "Fragrance Preferences",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our custom service team. A specialist will discuss fragrance preferences for your cleaning.",
    options: [{ id: "services-special", label: "Back to special requests" }],
  },

  "services-special-areas": {
    id: "services-special-areas",
    title: "Specific Areas Focus",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our custom service team. A specialist will discuss focusing on specific areas during cleaning.",
    options: [{ id: "services-special", label: "Back to special requests" }],
  },

  "services-special-other": {
    id: "services-special-other",
    title: "Other Special Requests",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our custom service team. A specialist will help with your special cleaning requests.",
    options: [{ id: "services-special", label: "Back to special requests" }],
  },

  "services-products": {
    id: "services-products",
    title: "Cleaning Products Used",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about the cleaning products we use.",
    options: [{ id: "services", label: "Back to service questions" }],
  },

  "services-eco": {
    id: "services-eco",
    title: "Eco-friendly Options",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about our eco-friendly cleaning options.",
    options: [{ id: "services", label: "Back to service questions" }],
  },

  "services-time": {
    id: "services-time",
    title: "Service Duration",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our service information team. A specialist will provide details about typical service durations.",
    options: [{ id: "services", label: "Back to service questions" }],
  },

  // Billing branch
  billing: {
    id: "billing",
    title: "Billing & Payments",
    message: "What billing or payment issue do you need help with?",
    options: [
      { id: "billing-invoice", label: "Invoice questions" },
      { id: "billing-payment", label: "Payment methods" },
      { id: "billing-refund", label: "Refund requests" },
      { id: "billing-discount", label: "Discounts and promotions" },
      { id: "billing-subscription", label: "Subscription billing" },
      { id: "root", label: "Back to main menu" },
    ],
  },

  "billing-invoice": {
    id: "billing-invoice",
    title: "Invoice Questions",
    message: "What invoice information do you need?",
    options: [
      { id: "billing-invoice-copy", label: "Request invoice copy" },
      { id: "billing-invoice-explain", label: "Explain charges" },
      { id: "billing-invoice-dispute", label: "Dispute a charge" },
      { id: "billing-invoice-receipt", label: "Request receipt" },
      { id: "billing", label: "Back to billing options" },
    ],
  },

  "billing-invoice-copy": {
    id: "billing-invoice-copy",
    title: "Request Invoice Copy",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our billing department. A specialist will help you get a copy of your invoice.",
    options: [{ id: "billing-invoice", label: "Back to invoice questions" }],
  },

  "billing-invoice-explain": {
    id: "billing-invoice-explain",
    title: "Explain Charges",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our billing department. A specialist will explain the charges on your invoice.",
    options: [{ id: "billing-invoice", label: "Back to invoice questions" }],
  },

  "billing-invoice-dispute": {
    id: "billing-invoice-dispute",
    title: "Dispute a Charge",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our billing department. A specialist will help you dispute a charge on your invoice.",
    options: [{ id: "billing-invoice", label: "Back to invoice questions" }],
  },

  "billing-invoice-receipt": {
    id: "billing-invoice-receipt",
    title: "Request Receipt",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our billing department. A specialist will help you get a receipt for your payment.",
    options: [{ id: "billing-invoice", label: "Back to invoice questions" }],
  },

  "billing-payment": {
    id: "billing-payment",
    title: "Payment Methods",
    message: "What payment method information do you need?",
    options: [
      { id: "billing-payment-add", label: "Add payment method" },
      { id: "billing-payment-update", label: "Update payment method" },
      { id: "billing-payment-remove", label: "Remove payment method" },
      { id: "billing-payment-options", label: "Available payment options" },
      { id: "billing", label: "Back to billing options" },
    ],
  },

  "billing-payment-add": {
    id: "billing-payment-add",
    title: "Add Payment Method",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment processing team. A specialist will help you add a new payment method.",
    options: [{ id: "billing-payment", label: "Back to payment method options" }],
  },

  "billing-payment-update": {
    id: "billing-payment-update",
    title: "Update Payment Method",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment processing team. A specialist will help you update your payment method.",
    options: [{ id: "billing-payment", label: "Back to payment method options" }],
  },

  "billing-payment-remove": {
    id: "billing-payment-remove",
    title: "Remove Payment Method",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment processing team. A specialist will help you remove a payment method.",
    options: [{ id: "billing-payment", label: "Back to payment method options" }],
  },

  "billing-payment-options": {
    id: "billing-payment-options",
    title: "Available Payment Options",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment processing team. A specialist will provide information about available payment options.",
    options: [{ id: "billing-payment", label: "Back to payment method options" }],
  },

  "billing-refund": {
    id: "billing-refund",
    title: "Refund Requests",
    message: "What type of refund are you requesting?",
    options: [
      { id: "billing-refund-service", label: "Service not completed" },
      { id: "billing-refund-quality", label: "Quality issues" },
      { id: "billing-refund-double", label: "Double charged" },
      { id: "billing-refund-cancel", label: "Cancelled service" },
      { id: "billing", label: "Back to billing options" },
    ],
  },

  "billing-refund-service": {
    id: "billing-refund-service",
    title: "Refund for Incomplete Service",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our refund department. A specialist will process your refund request for incomplete service.",
    options: [{ id: "billing-refund", label: "Back to refund options" }],
  },

  "billing-refund-quality": {
    id: "billing-refund-quality",
    title: "Refund for Quality Issues",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our refund department. A specialist will process your refund request for quality issues.",
    options: [{ id: "billing-refund", label: "Back to refund options" }],
  },

  "billing-refund-double": {
    id: "billing-refund-double",
    title: "Refund for Double Charge",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our refund department. A specialist will process your refund request for double charging.",
    options: [{ id: "billing-refund", label: "Back to refund options" }],
  },

  "billing-refund-cancel": {
    id: "billing-refund-cancel",
    title: "Refund for Cancelled Service",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our refund department. A specialist will process your refund request for cancelled service.",
    options: [{ id: "billing-refund", label: "Back to refund options" }],
  },

  "billing-discount": {
    id: "billing-discount",
    title: "Discounts and Promotions",
    message: "What discount information do you need?",
    options: [
      { id: "billing-discount-current", label: "Current promotions" },
      { id: "billing-discount-apply", label: "Apply a promo code" },
      { id: "billing-discount-loyalty", label: "Loyalty program" },
      { id: "billing-discount-referral", label: "Referral discounts" },
      { id: "billing", label: "Back to billing options" },
    ],
  },

  "billing-discount-current": {
    id: "billing-discount-current",
    title: "Current Promotions",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our promotions team. A specialist will provide information about current promotions.",
    options: [{ id: "billing-discount", label: "Back to discount options" }],
  },

  "billing-discount-apply": {
    id: "billing-discount-apply",
    title: "Apply a Promo Code",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our promotions team. A specialist will help you apply a promo code to your account.",
    options: [{ id: "billing-discount", label: "Back to discount options" }],
  },

  "billing-discount-loyalty": {
    id: "billing-discount-loyalty",
    title: "Loyalty Program",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our promotions team. A specialist will provide information about our loyalty program.",
    options: [{ id: "billing-discount", label: "Back to discount options" }],
  },

  "billing-discount-referral": {
    id: "billing-discount-referral",
    title: "Referral Discounts",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our promotions team. A specialist will provide information about our referral discount program.",
    options: [{ id: "billing-discount", label: "Back to discount options" }],
  },

  "billing-subscription": {
    id: "billing-subscription",
    title: "Subscription Billing",
    message: "What subscription information do you need?",
    options: [
      { id: "billing-subscription-start", label: "Start a subscription" },
      { id: "billing-subscription-modify", label: "Modify subscription" },
      { id: "billing-subscription-cancel", label: "Cancel subscription" },
      { id: "billing-subscription-status", label: "Check subscription status" },
      { id: "billing", label: "Back to billing options" },
    ],
  },

  "billing-subscription-start": {
    id: "billing-subscription-start",
    title: "Start a Subscription",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our subscription team. A specialist will help you start a new subscription.",
    options: [{ id: "billing-subscription", label: "Back to subscription options" }],
  },

  "billing-subscription-modify": {
    id: "billing-subscription-modify",
    title: "Modify Subscription",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our subscription team. A specialist will help you modify your subscription.",
    options: [{ id: "billing-subscription", label: "Back to subscription options" }],
  },

  "billing-subscription-cancel": {
    id: "billing-subscription-cancel",
    title: "Cancel Subscription",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our subscription team. A specialist will help you cancel your subscription.",
    options: [{ id: "billing-subscription", label: "Back to subscription options" }],
  },

  "billing-subscription-status": {
    id: "billing-subscription-status",
    title: "Check Subscription Status",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our subscription team. A specialist will help you check your subscription status.",
    options: [{ id: "billing-subscription", label: "Back to subscription options" }],
  },

  // Technical Support branch
  technical: {
    id: "technical",
    title: "Technical Support",
    message: "What technical issue are you experiencing?",
    options: [
      { id: "technical-website", label: "Website issues" },
      { id: "technical-app", label: "Mobile app problems" },
      { id: "technical-account", label: "Account access" },
      { id: "technical-booking", label: "Online booking system" },
      { id: "technical-payment", label: "Payment processing" },
      { id: "root", label: "Back to main menu" },
    ],
  },

  "technical-website": {
    id: "technical-website",
    title: "Website Issues",
    message: "What website issue are you experiencing?",
    options: [
      { id: "technical-website-loading", label: "Pages not loading" },
      { id: "technical-website-forms", label: "Forms not submitting" },
      { id: "technical-website-display", label: "Display or layout issues" },
      { id: "technical-website-browser", label: "Browser compatibility" },
      { id: "technical", label: "Back to technical support" },
    ],
  },

  "technical-website-loading": {
    id: "technical-website-loading",
    title: "Pages Not Loading",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our web support team. A technical specialist will help resolve your page loading issues.",
    options: [{ id: "technical-website", label: "Back to website issues" }],
  },

  "technical-website-forms": {
    id: "technical-website-forms",
    title: "Forms Not Submitting",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our web support team. A technical specialist will help resolve your form submission issues.",
    options: [{ id: "technical-website", label: "Back to website issues" }],
  },

  "technical-website-display": {
    id: "technical-website-display",
    title: "Display or Layout Issues",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our web support team. A technical specialist will help resolve your display or layout issues.",
    options: [{ id: "technical-website", label: "Back to website issues" }],
  },

  "technical-website-browser": {
    id: "technical-website-browser",
    title: "Browser Compatibility",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our web support team. A technical specialist will help resolve your browser compatibility issues.",
    options: [{ id: "technical-website", label: "Back to website issues" }],
  },

  "technical-app": {
    id: "technical-app",
    title: "Mobile App Problems",
    message: "What app issue are you experiencing?",
    options: [
      { id: "technical-app-crash", label: "App crashes" },
      { id: "technical-app-login", label: "Login issues" },
      { id: "technical-app-booking", label: "Booking problems" },
      { id: "technical-app-notifications", label: "Notification issues" },
      { id: "technical-app-update", label: "Update problems" },
      { id: "technical", label: "Back to technical support" },
    ],
  },

  "technical-app-crash": {
    id: "technical-app-crash",
    title: "App Crashes",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our app support team. A technical specialist will help resolve your app crash issues.",
    options: [{ id: "technical-app", label: "Back to app problems" }],
  },

  "technical-app-login": {
    id: "technical-app-login",
    title: "App Login Issues",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our app support team. A technical specialist will help resolve your app login issues.",
    options: [{ id: "technical-app", label: "Back to app problems" }],
  },

  "technical-app-booking": {
    id: "technical-app-booking",
    title: "App Booking Problems",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our app support team. A technical specialist will help resolve your app booking issues.",
    options: [{ id: "technical-app", label: "Back to app problems" }],
  },

  "technical-app-notifications": {
    id: "technical-app-notifications",
    title: "App Notification Issues",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our app support team. A technical specialist will help resolve your app notification issues.",
    options: [{ id: "technical-app", label: "Back to app problems" }],
  },

  "technical-app-update": {
    id: "technical-app-update",
    title: "App Update Problems",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our app support team. A technical specialist will help resolve your app update issues.",
    options: [{ id: "technical-app", label: "Back to app problems" }],
  },

  "technical-account": {
    id: "technical-account",
    title: "Account Access",
    message: "What account issue are you experiencing?",
    options: [
      { id: "technical-account-login", label: "Can't log in" },
      { id: "technical-account-password", label: "Password reset" },
      { id: "technical-account-update", label: "Can't update profile" },
      { id: "technical-account-delete", label: "Account deletion" },
      { id: "technical", label: "Back to technical support" },
    ],
  },

  "technical-account-login": {
    id: "technical-account-login",
    title: "Can't Log In",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our account support team. A specialist will help with your login issues.",
    options: [{ id: "technical-account", label: "Back to account issues" }],
  },

  "technical-account-password": {
    id: "technical-account-password",
    title: "Password Reset",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our account support team. A specialist will help you reset your password.",
    options: [{ id: "technical-account", label: "Back to account issues" }],
  },

  "technical-account-update": {
    id: "technical-account-update",
    title: "Can't Update Profile",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our account support team. A specialist will help with your profile update issues.",
    options: [{ id: "technical-account", label: "Back to account issues" }],
  },

  "technical-account-delete": {
    id: "technical-account-delete",
    title: "Account Deletion",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our account support team. A specialist will help with your account deletion request.",
    options: [{ id: "technical-account", label: "Back to account issues" }],
  },

  "technical-booking": {
    id: "technical-booking",
    title: "Online Booking System",
    message: "What booking system issue are you experiencing?",
    options: [
      { id: "technical-booking-error", label: "Error messages" },
      { id: "technical-booking-calendar", label: "Calendar not loading" },
      { id: "technical-booking-confirmation", label: "No confirmation received" },
      { id: "technical-booking-payment", label: "Payment processing error" },
      { id: "technical", label: "Back to technical support" },
    ],
  },

  "technical-booking-error": {
    id: "technical-booking-error",
    title: "Booking Error Messages",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our booking system support team. A specialist will help with your booking error messages.",
    options: [{ id: "technical-booking", label: "Back to booking system issues" }],
  },

  "technical-booking-calendar": {
    id: "technical-booking-calendar",
    title: "Calendar Not Loading",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our booking system support team. A specialist will help with your calendar loading issues.",
    options: [{ id: "technical-booking", label: "Back to booking system issues" }],
  },

  "technical-booking-confirmation": {
    id: "technical-booking-confirmation",
    title: "No Confirmation Received",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our booking system support team. A specialist will help with your missing confirmation issues.",
    options: [{ id: "technical-booking", label: "Back to booking system issues" }],
  },

  "technical-booking-payment": {
    id: "technical-booking-payment",
    title: "Payment Processing Error",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our booking system support team. A specialist will help with your payment processing errors.",
    options: [{ id: "technical-booking", label: "Back to booking system issues" }],
  },

  "technical-payment": {
    id: "technical-payment",
    title: "Payment Processing",
    message: "What payment processing issue are you experiencing?",
    options: [
      { id: "technical-payment-declined", label: "Payment declined" },
      { id: "technical-payment-stuck", label: "Payment stuck processing" },
      { id: "technical-payment-duplicate", label: "Duplicate charges" },
      { id: "technical-payment-method", label: "Can't add payment method" },
      { id: "technical", label: "Back to technical support" },
    ],
  },

  "technical-payment-declined": {
    id: "technical-payment-declined",
    title: "Payment Declined",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment support team. A specialist will help with your declined payment issues.",
    options: [{ id: "technical-payment", label: "Back to payment processing issues" }],
  },

  "technical-payment-stuck": {
    id: "technical-payment-stuck",
    title: "Payment Stuck Processing",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment support team. A specialist will help with your stuck payment issues.",
    options: [{ id: "technical-payment", label: "Back to payment processing issues" }],
  },

  "technical-payment-duplicate": {
    id: "technical-payment-duplicate",
    title: "Duplicate Charges",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment support team. A specialist will help with your duplicate charge issues.",
    options: [{ id: "technical-payment", label: "Back to payment processing issues" }],
  },

  "technical-payment-method": {
    id: "technical-payment-method",
    title: "Can't Add Payment Method",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our payment support team. A specialist will help with adding your payment method.",
    options: [{ id: "technical-payment", label: "Back to payment processing issues" }],
  },

  // Accessibility Support branch
  accessibility: {
    id: "accessibility",
    title: "Accessibility Support",
    message: "What accessibility assistance do you need?",
    options: [
      { id: "accessibility-features", label: "Accessibility features" },
      { id: "accessibility-navigation", label: "Navigation assistance" },
      { id: "accessibility-reading", label: "Reading assistance" },
      { id: "accessibility-booking", label: "Booking assistance" },
      { id: "accessibility-feedback", label: "Provide accessibility feedback" },
      { id: "root", label: "Back to main menu" },
    ],
  },

  "accessibility-features": {
    id: "accessibility-features",
    title: "Accessibility Features",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our accessibility team. A specialist will explain our accessibility features.",
    options: [{ id: "accessibility", label: "Back to accessibility support" }],
  },

  "accessibility-navigation": {
    id: "accessibility-navigation",
    title: "Navigation Assistance",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our accessibility team. A specialist will provide navigation assistance.",
    options: [{ id: "accessibility", label: "Back to accessibility support" }],
  },

  "accessibility-reading": {
    id: "accessibility-reading",
    title: "Reading Assistance",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our accessibility team. A specialist will provide reading assistance.",
    options: [{ id: "accessibility", label: "Back to accessibility support" }],
  },

  "accessibility-booking": {
    id: "accessibility-booking",
    title: "Booking Assistance",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our accessibility team. A specialist will provide booking assistance.",
    options: [{ id: "accessibility", label: "Back to accessibility support" }],
  },

  "accessibility-feedback": {
    id: "accessibility-feedback",
    title: "Provide Accessibility Feedback",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our accessibility team. A specialist will collect your accessibility feedback.",
    options: [{ id: "accessibility", label: "Back to accessibility support" }],
  },

  // Other Inquiries branch
  other: {
    id: "other",
    title: "Other Inquiries",
    message: "How else can we help you?",
    options: [
      { id: "other-feedback", label: "Provide feedback" },
      { id: "other-careers", label: "Career opportunities" },
      { id: "other-contact", label: "Contact information" },
      { id: "other-partnership", label: "Business partnerships" },
      { id: "other-press", label: "Press inquiries" },
      { id: "root", label: "Back to main menu" },
    ],
  },

  "other-feedback": {
    id: "other-feedback",
    title: "Provide Feedback",
    message: "What type of feedback would you like to provide?",
    options: [
      { id: "other-feedback-service", label: "Service feedback" },
      { id: "other-feedback-staff", label: "Staff feedback" },
      { id: "other-feedback-website", label: "Website feedback" },
      { id: "other-feedback-app", label: "Mobile app feedback" },
      { id: "other-feedback-general", label: "General feedback" },
      { id: "other", label: "Back to other inquiries" },
    ],
  },

  "other-feedback-service": {
    id: "other-feedback-service",
    title: "Service Feedback",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our customer experience team. We value your feedback about our services!",
    options: [{ id: "other-feedback", label: "Back to feedback options" }],
  },

  "other-feedback-staff": {
    id: "other-feedback-staff",
    title: "Staff Feedback",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our customer experience team. We value your feedback about our staff!",
    options: [{ id: "other-feedback", label: "Back to feedback options" }],
  },

  "other-feedback-website": {
    id: "other-feedback-website",
    title: "Website Feedback",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our web team. We value your feedback about our website!",
    options: [{ id: "other-feedback", label: "Back to feedback options" }],
  },

  "other-feedback-app": {
    id: "other-feedback-app",
    title: "Mobile App Feedback",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our app development team. We value your feedback about our mobile app!",
    options: [{ id: "other-feedback", label: "Back to feedback options" }],
  },

  "other-feedback-general": {
    id: "other-feedback-general",
    title: "General Feedback",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our customer experience team. We value your general feedback!",
    options: [{ id: "other-feedback", label: "Back to feedback options" }],
  },

  "other-careers": {
    id: "other-careers",
    title: "Career Opportunities",
    message: "What career information are you looking for?",
    options: [
      { id: "other-careers-openings", label: "Current job openings" },
      { id: "other-careers-apply", label: "How to apply" },
      { id: "other-careers-benefits", label: "Benefits information" },
      { id: "other-careers-culture", label: "Company culture" },
      { id: "other", label: "Back to other inquiries" },
    ],
  },

  "other-careers-openings": {
    id: "other-careers-openings",
    title: "Current Job Openings",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our HR department. A team member will provide information about current job openings.",
    options: [{ id: "other-careers", label: "Back to career options" }],
  },

  "other-careers-apply": {
    id: "other-careers-apply",
    title: "How to Apply",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our HR department. A team member will provide information about our application process.",
    options: [{ id: "other-careers", label: "Back to career options" }],
  },

  "other-careers-benefits": {
    id: "other-careers-benefits",
    title: "Benefits Information",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our HR department. A team member will provide information about our employee benefits.",
    options: [{ id: "other-careers", label: "Back to career options" }],
  },

  "other-careers-culture": {
    id: "other-careers-culture",
    title: "Company Culture",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our HR department. A team member will provide information about our company culture.",
    options: [{ id: "other-careers", label: "Back to career options" }],
  },

  "other-contact": {
    id: "other-contact",
    title: "Contact Information",
    message: "What contact information do you need?",
    options: [
      { id: "other-contact-phone", label: "Phone numbers" },
      { id: "other-contact-email", label: "Email addresses" },
      { id: "other-contact-office", label: "Office locations" },
      { id: "other-contact-hours", label: "Business hours" },
      { id: "other", label: "Back to other inquiries" },
    ],
  },

  "other-contact-phone": {
    id: "other-contact-phone",
    title: "Phone Numbers",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our contact information page. You'll find all our phone numbers there.",
    options: [{ id: "other-contact", label: "Back to contact information" }],
  },

  "other-contact-email": {
    id: "other-contact-email",
    title: "Email Addresses",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our contact information page. You'll find all our email addresses there.",
    options: [{ id: "other-contact", label: "Back to contact information" }],
  },

  "other-contact-office": {
    id: "other-contact-office",
    title: "Office Locations",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our contact information page. You'll find all our office locations there.",
    options: [{ id: "other-contact", label: "Back to contact information" }],
  },

  "other-contact-hours": {
    id: "other-contact-hours",
    title: "Business Hours",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our contact information page. You'll find our business hours there.",
    options: [{ id: "other-contact", label: "Back to contact information" }],
  },

  "other-partnership": {
    id: "other-partnership",
    title: "Business Partnerships",
    isEndpoint: true,
    endpointMessage:
      "Redirecting you to our business development team. A team member will discuss partnership opportunities with you.",
    options: [{ id: "other", label: "Back to other inquiries" }],
  },

  "other-press": {
    id: "other-press",
    title: "Press Inquiries",
    isEndpoint: true,
    endpointMessage: "Redirecting you to our public relations team. A team member will assist with your press inquiry.",
    options: [{ id: "other", label: "Back to other inquiries" }],
  },
}

type SupportBotContextType = {
  isOpen: boolean
  openSupportBot: () => void
  closeSupportBot: () => void
  currentNodeId: string
  navigateTo: (nodeId: string) => void
  currentNode: SupportNode
  supportHistory: string[]
  goBack: () => void
}

const SupportBotContext = createContext<SupportBotContextType | undefined>(undefined)

export function SupportBotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState("root")
  const [supportHistory, setSupportHistory] = useState<string[]>([])

  const openSupportBot = () => setIsOpen(true)
  const closeSupportBot = () => {
    setIsOpen(false)
    setCurrentNodeId("root")
    setSupportHistory([])
  }

  const navigateTo = (nodeId: string) => {
    if (nodeId === "root") {
      setSupportHistory([])
    } else if (nodeId !== currentNodeId) {
      setSupportHistory([...supportHistory, currentNodeId])
    }
    setCurrentNodeId(nodeId)
  }

  const goBack = () => {
    if (supportHistory.length > 0) {
      const prevNode = supportHistory[supportHistory.length - 1]
      setCurrentNodeId(prevNode)
      setSupportHistory(supportHistory.slice(0, -1))
    } else {
      setCurrentNodeId("root")
    }
  }

  const currentNode = supportTree[currentNodeId] || supportTree.root

  return (
    <SupportBotContext.Provider
      value={{
        isOpen,
        openSupportBot,
        closeSupportBot,
        currentNodeId,
        navigateTo,
        currentNode,
        supportHistory,
        goBack,
      }}
    >
      {children}
    </SupportBotContext.Provider>
  )
}

export const useSupportBot = () => {
  const context = useContext(SupportBotContext)
  if (context === undefined) {
    throw new Error("useSupportBot must be used within a SupportBotProvider")
  }
  return context
}
