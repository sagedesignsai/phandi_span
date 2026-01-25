"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardLayout, WizardStep } from '@/components/ui/wizard-layout';
import { CareerGoalsStep } from './wizard-steps/career-goals-step';
import { WorkPreferencesStep } from './wizard-steps/work-preferences-step';
import { ProfessionalProfileStep } from './wizard-steps/professional-profile-step';
import { CompletionStep } from './wizard-steps/completion-step';
import { useCareerProfile } from '@/lib/hooks/use-career-profile';
import { TargetIcon, BriefcaseIcon, UserIcon, CheckCircle2Icon } from 'lucide-react';
import type { CareerProfileContext } from '@/lib/models/career-profile';
import { toast } from 'sonner';

interface CareerProfileWizardProps {
  resumeId: string;
  onComplete?: (profile: CareerProfileContext) => void;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'goals',
    title: 'Career Goals',
    description: 'Define your aspirations',
    icon: <TargetIcon className="w-5 h-5" />,
  },
  {
    id: 'preferences',
    title: 'Work Preferences',
    description: 'Set your ideal conditions',
    icon: <BriefcaseIcon className="w-5 h-5" />,
  },
  {
    id: 'profile',
    title: 'Professional Profile',
    description: 'Describe your identity',
    icon: <UserIcon className="w-5 h-5" />,
  },
  {
    id: 'complete',
    title: 'Complete',
    description: 'Review and finish',
    icon: <CheckCircle2Icon className="w-5 h-5" />,
  },
];

export function CareerProfileWizard({ resumeId, onComplete }: CareerProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<CareerProfileContext>({});
  const { updateProfile, isLoading } = useCareerProfile({ resumeId, autoFetch: false });
  const router = useRouter();

  const updateData = (newData: Partial<CareerProfileContext>) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = async () => {
    if (currentStep === wizardSteps.length - 2) {
      // Save profile before going to completion step
      try {
        const savedProfile = await updateProfile(profileData);
        toast.success('Career profile saved successfully!');
        onComplete?.(savedProfile);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        toast.error('Failed to save career profile');
      }
    } else if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep + 1 && stepIndex < wizardSteps.length - 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleFinish = () => {
    router.push(`/dashboard/careers/${resumeId}`);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: // Goals step
        return !!(profileData.careerGoals?.shortTerm || profileData.careerGoals?.longTerm);
      case 1: // Preferences step
        return !!(profileData.workPreferences?.workType || profileData.workPreferences?.employmentType);
      case 2: // Profile step
        return !!profileData.professionalSummary;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <CareerGoalsStep data={profileData} onChange={updateData} />;
      case 1:
        return <WorkPreferencesStep data={profileData} onChange={updateData} />;
      case 2:
        return <ProfessionalProfileStep data={profileData} onChange={updateData} />;
      case 3:
        return <CompletionStep data={profileData} onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    if (currentStep === wizardSteps.length - 2) return 'Save & Complete';
    if (currentStep === wizardSteps.length - 1) return 'Finish';
    return 'Next';
  };

  return (
    <WizardLayout
      steps={wizardSteps}
      currentStep={currentStep}
      onNext={currentStep < wizardSteps.length - 1 ? handleNext : undefined}
      onPrevious={currentStep > 0 ? handlePrevious : undefined}
      onStepClick={handleStepClick}
      nextLabel={getNextLabel()}
      canGoNext={canGoNext()}
      canGoPrevious={currentStep > 0}
      isLoading={isLoading}
    >
      {renderStepContent()}
    </WizardLayout>
  );
}
