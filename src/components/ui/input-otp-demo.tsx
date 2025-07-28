"use client";

import { useState } from "react";
import { Button } from "./button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp";
import type { SlotProps } from "input-otp";

interface InputOTPDemoProps {
	maxLength?: number;
	disabled?: boolean;
	autoFocus?: boolean;
	containerClassName?: string;
	showSeparator?: boolean;
	customStyling?: boolean;
	showValidation?: boolean;
	showClearButton?: boolean;
	size?: "small" | "default" | "large";
}

export function InputOTPDemo({
	maxLength = 4,
	disabled = false,
	autoFocus = false,
	containerClassName,
	showSeparator = false,
	customStyling = false,
	showValidation = false,
	showClearButton = false,
	size = "default",
}: InputOTPDemoProps) {
	const [value, setValue] = useState("");
	const [isValid, setIsValid] = useState(true);

	const handleChange = (newValue: string) => {
		setValue(newValue);
		if (showValidation && newValue.length === maxLength) {
			const allSame = newValue.split("").every((char) => char === newValue[0]);
			setIsValid(!allSame);
		} else {
			setIsValid(true);
		}
	};

	const handleClear = () => {
		setValue("");
	};

	const getSlotClassName = () => {
		if (customStyling) {
			return "h-12 w-12 text-lg font-bold border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500/20";
		}

		switch (size) {
			case "small":
				return "h-8 w-8 text-sm";
			case "large":
				return "h-12 w-12 text-lg font-semibold";
			default:
				return "";
		}
	};

	const renderSlots = (slots: SlotProps[]) => {
		if (showSeparator && maxLength === 6) {
			return (
				<>
					{slots.slice(0, 3).map((slot, index) => (
						<InputOTPSlot key={index} {...slot} index={index} className={getSlotClassName()} />
					))}
					<InputOTPSeparator />
					{slots.slice(3).map((slot, index) => (
						<InputOTPSlot key={index + 3} {...slot} index={index + 3} className={getSlotClassName()} />
					))}
				</>
			);
		}

		return slots.map((slot, index) => (
			<InputOTPSlot key={index} {...slot} index={index} className={getSlotClassName()} />
		));
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label htmlFor="otp-demo" className="text-sm font-medium">
					{showValidation
						? "OTP with validation"
						: customStyling
							? "Custom styled OTP input"
							: showSeparator
								? "Enter your code with separators"
								: `Enter your ${maxLength}-digit code`}
				</label>
				<div className="flex items-center gap-2">
					<InputOTP
						id="otp-demo"
						value={value}
						onChange={handleChange}
						maxLength={maxLength}
						disabled={disabled}
						autoFocus={autoFocus}
						containerClassName={containerClassName}
						aria-invalid={showValidation ? !isValid : undefined}
						render={({ slots }) => <InputOTPGroup>{renderSlots(slots)}</InputOTPGroup>}
					/>
					{showClearButton && (
						<Button variant="outline" size="sm" onClick={handleClear} disabled={!value}>
							Clear
						</Button>
					)}
				</div>
				{showValidation && !isValid && (
					<p className="text-destructive text-sm">Error: All digits cannot be the same</p>
				)}
			</div>
			<div className="text-muted-foreground text-sm">Entered value: {value || "No value entered"}</div>
		</div>
	);
}

// Demo component for multiple sizes
export function InputOTPSizesDemo() {
	return (
		<div className="space-y-6">
			<InputOTPDemo maxLength={4} size="small" showClearButton />
			<InputOTPDemo maxLength={4} size="default" showClearButton />
			<InputOTPDemo maxLength={4} size="large" showClearButton />
		</div>
	);
}
