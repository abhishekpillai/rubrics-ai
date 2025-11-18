'use client';

import { WizardProvider, useWizard } from '@/lib/wizardContext';
import WizardLayout from './components/WizardLayout';
import Step1_JobInput from './components/Step1_JobInput';
import Step2_CompetencyEditor from './components/Step2_CompetencyEditor';
import Step2_5_InterviewFocus from './components/Step2_5_InterviewFocus';
import Step3_QuestionEditor from './components/Step3_QuestionEditor';
import Step4_AgendaBuilder from './components/Step4_AgendaBuilder';
import Step5_RubricBuilder from './components/Step5_RubricBuilder';
import Step6_Results from './components/Step6_Results';

// Main wizard content (needs to be inside WizardProvider)
function WizardContent() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1_JobInput />;
      case 2:
        return <Step2_CompetencyEditor />;
      case 2.5:
        return <Step2_5_InterviewFocus />;
      case 3:
        return <Step3_QuestionEditor />;
      case 4:
        return <Step4_AgendaBuilder />;
      case 5:
        return <Step5_RubricBuilder />;
      case 6:
        return <Step6_Results />;
      default:
        return <Step1_JobInput />;
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
}

// Root page component
export default function Home() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
