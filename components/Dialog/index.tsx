"use client"
import { useState, type ReactNode } from "react"

type DialogProps = {
  children: ReactNode
}

export default function Dialog({ children }: DialogProps) {

    return (
        <div className="modal">
        {children}
        </div>
    )
}