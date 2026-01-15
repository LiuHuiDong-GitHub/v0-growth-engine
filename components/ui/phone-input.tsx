"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Check, Search, ChevronDown } from "lucide-react"

// International phone country codes with flags
const PHONE_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", prefix: "+1", example: "(201) 555-0123" },
  { code: "CN", name: "China", flag: "🇨🇳", prefix: "+86", example: "123 4567 8900" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", prefix: "+44", example: "7911 123456" },
  { code: "JP", name: "Japan", flag: "🇯🇵", prefix: "+81", example: "90-1234-5678" },
  { code: "DE", name: "Germany", flag: "🇩🇪", prefix: "+49", example: "30 123456789" },
  { code: "FR", name: "France", flag: "🇫🇷", prefix: "+33", example: "1 42 68 53 00" },
  { code: "IN", name: "India", flag: "🇮🇳", prefix: "+91", example: "98765 43210" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", prefix: "+55", example: "(11) 98765-4321" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", prefix: "+52", example: "55 1234 5678" },
  { code: "CA", name: "Canada", flag: "🇨🇦", prefix: "+1", example: "(201) 555-0123" },
  { code: "AU", name: "Australia", flag: "🇦🇺", prefix: "+61", example: "2 1234 5678" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", prefix: "+65", example: "6787 1234" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", prefix: "+82", example: "10-1234-5678" },
  { code: "RU", name: "Russia", flag: "🇷🇺", prefix: "+7", example: "495 123-45-67" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  defaultCountry?: string
  error?: string
  disabled?: boolean
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  placeholder = "Enter phone number",
  defaultCountry = "US",
  error,
  disabled = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(
    PHONE_COUNTRIES.find((c) => c.code === defaultCountry) || PHONE_COUNTRIES[0],
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [showDropdown])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSearchQuery("")
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const filteredCountries = PHONE_COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.prefix.includes(searchQuery),
  )

  const handleCountrySelect = (country: (typeof PHONE_COUNTRIES)[0]) => {
    setSelectedCountry(country)
    setShowDropdown(false)
    setSearchQuery("")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "") // Only digits

    // Auto-format based on country
    if (selectedCountry.code === "US" || selectedCountry.code === "CA") {
      // Format: (123) 456-7890
      if (inputValue.length > 0) {
        if (inputValue.length <= 3) {
          inputValue = inputValue
        } else if (inputValue.length <= 6) {
          inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`
        } else {
          inputValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3, 6)}-${inputValue.slice(6, 10)}`
        }
      }
    } else if (selectedCountry.code === "CN") {
      // Format: 123 4567 8900
      if (inputValue.length > 0) {
        if (inputValue.length <= 3) {
          inputValue = inputValue
        } else if (inputValue.length <= 7) {
          inputValue = `${inputValue.slice(0, 3)} ${inputValue.slice(3)}`
        } else {
          inputValue = `${inputValue.slice(0, 3)} ${inputValue.slice(3, 7)} ${inputValue.slice(7, 11)}`
        }
      }
    }

    onChange(inputValue)
  }

  const getE164Value = () => {
    const digitsOnly = value.replace(/\D/g, "")
    return digitsOnly ? `${selectedCountry.prefix}${digitsOnly}` : ""
  }

  const renderDropdown = () => {
    if (!showDropdown || !mounted) return null

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className="fixed z-[99999] bg-white border border-slate-200 rounded-lg shadow-2xl w-48 pointer-events-auto"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          position: "fixed",
          willChange: "transform",
        }}
      >
        {/* Search Input */}
        <div className="p-2 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              aria-label="Search countries"
            />
          </div>
        </div>

        {/* Country List */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  selectedCountry.code === country.code
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
                role="option"
                aria-selected={selectedCountry.code === country.code}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{country.name}</div>
                      <div className="text-xs text-slate-500">{country.prefix}</div>
                    </div>
                  </div>
                  {selectedCountry.code === country.code && <Check className="h-3 w-3 flex-shrink-0" />}
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-xs text-slate-500 text-center">No results</div>
          )}
        </div>
      </div>
    )

    return createPortal(dropdownContent, document.body)
  }

  return (
    <div className="w-full space-y-1 relative" ref={containerRef}>
      <div className="flex gap-1 items-center">
        {/* Country Selector */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={disabled}
            className={`flex items-center border border-dotted transition-all py-0 flex-shrink-0 h-[22px] px-0 gap-0 ${
              error ? "border-red-500 bg-red-50" : "border-slate-300 bg-transparent hover:border-slate-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-slate-800`}
            aria-label="Select country"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          >
            <span className="text-xs flex-shrink-0">{selectedCountry.flag}</span>
            <span className="text-[8px] font-medium text-slate-700 min-w-fit">{selectedCountry.prefix}</span>
            <ChevronDown className="h-2 w-2 text-slate-400 flex-shrink-0" />
          </button>

          {renderDropdown()}
        </div>

        {/* Phone Input Field */}
        <input
          ref={inputRef}
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          placeholder={placeholder || `e.g. ${selectedCountry.example}`}
          disabled={disabled}
          aria-label="Phone number"
          aria-invalid={!!error}
          aria-describedby={error ? "phone-error" : undefined}
          className={`flex-1 border border-dotted transition-all focus:outline-none h-[22px] px-0.5 ml-[-2px] pr-px ${
            error ? "border-red-500 bg-red-50" : "border-slate-300 bg-transparent hover:border-slate-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} text-xs text-slate-800 placeholder:text-[10px]`}
          style={{ flex: "1.01" }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p id="phone-error" className="text-[10px] text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* E.164 Format Display (for developers) */}
      {value && (
        <p className="text-[10px] text-slate-500">
          International format: <span className="font-mono text-slate-700">{getE164Value()}</span>
        </p>
      )}
    </div>
  )
}
