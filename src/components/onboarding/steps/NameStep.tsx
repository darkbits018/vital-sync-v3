import React, { useState, useEffect, useRef } from 'react';
import { OnboardingStep } from '../OnboardingStep';

interface NameStepProps {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function NameStep({ value, onChange, onNext, onBack }: NameStepProps) {
  const [name, setName] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNext = () => {
    if (name.trim().length >= 2) {
      onChange(name.trim());
      onNext();
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <OnboardingStep
      title="What's your name?"
      subtitle="We'll use this to personalize your experience"
      onNext={handleNext}
      onBack={onBack}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && isValid && handleNext()}
          placeholder="Your name"
          className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-center"
        />
        
        <p className="text-purple-200 text-sm text-center">
          Enter your name (at least 2 characters)
        </p>
      </div>
    </OnboardingStep>
  );
}