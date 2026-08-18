// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { ModusWcCard, ModusWcButton, ModusWcTextInput, ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    payment: ''
  });
  const progressRef = useRef(null);

  const steps = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'address', label: 'Address' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.value = progress;
    }
  }, [progress]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <ModusWcTextInput
              label="Name"
              value={formData.name}
              onInputChange={(e: CustomEvent) => setFormData({ ...formData, name: e.detail?.target?.value || '' })}
            />
            <ModusWcTextInput
              label="Email"
              value={formData.email}
              onInputChange={(e: CustomEvent) => setFormData({ ...formData, email: e.detail?.target?.value || '' })}
            />
          </>
        );
      case 1:
        return (
          <>
            <ModusWcTextInput
              label="Address"
              value={formData.address}
              onInputChange={(e: CustomEvent) => setFormData({ ...formData, address: e.detail?.target?.value || '' })}
            />
            <ModusWcTextInput
              label="City"
              value={formData.city}
              onInputChange={(e: CustomEvent) => setFormData({ ...formData, city: e.detail?.target?.value || '' })}
            />
          </>
        );
      case 2:
        return (
          <ModusWcTextInput
            label="Payment Method"
            value={formData.payment}
            onInputChange={(e: CustomEvent) => setFormData({ ...formData, payment: e.detail?.target?.value || '' })}
          />
        );
      default:
        return (
          <>
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Review Your Information" />
            <div className="grid gap-2">
              <ModusWcTypography hierarchy="p" size="sm" label={`Name: ${formData.name}`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`Email: ${formData.email}`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`Address: ${formData.address}`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`City: ${formData.city}`} />
              <ModusWcTypography hierarchy="p" size="sm" label={`Payment: ${formData.payment}`} />
            </div>
          </>
        );
    }
  };

  return (
    <ModusWcCard customClass="max-w-2xl mx-auto">
      <div className="p-4 grid gap-6">
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ModusWcProgress ref={progressRef} value={progress} max={100} customClass="h-2" />
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label={steps[currentStep].label} />
        </div>

        <div className="grid gap-4">
          {renderStepContent()}
        </div>

        <div className="flex justify-between">
          <ModusWcButton
            variant="outlined"
            color="tertiary"
            onButtonClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </ModusWcButton>
          {currentStep < steps.length - 1 ? (
            <ModusWcButton onButtonClick={handleNext}>
              Next
            </ModusWcButton>
          ) : (
            <ModusWcButton>
              Submit
            </ModusWcButton>
          )}
        </div>
      </div>
    </ModusWcCard>
  );
}

export default MultiStepForm;
