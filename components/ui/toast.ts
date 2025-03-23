"use client"
import * as ToastPrimitives from "@radix-ui/react-toast"
import type React from "react"

export type ToastActionElement = React.ReactNode
export type ToastProps = ToastPrimitives.ToastProps

const ToastProvider = ToastPrimitives.Provider
const ToastViewport = ToastPrimitives.Viewport
const Toast = ToastPrimitives.Root
const ToastTitle = ToastPrimitives.Title
const ToastDescription = ToastPrimitives.Description
const ToastClose = ToastPrimitives.Close
const ToastAction = ToastPrimitives.Action

const useToast = () => {
  return {
    toast: (args: any) => {
      console.log("Toast:", args)
    },
  }
}

export { useToast, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }

