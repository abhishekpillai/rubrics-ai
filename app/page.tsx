'use client';

import { WizardProvider, useWizard } from '@/lib/wizardContext';
import WizardLayout from './components/WizardLayout';
import Step1_JobInput from './components/Step1_JobInput';
import Step2_CompetencyEditor from './components/Step2_CompetencyEditor';
import Step3_RubricEditor from './components/Step3_RubricEditor';
import Step4_InterviewFocus from './components/Step4_InterviewFocus';
import Step5_QuestionEditor from './components/Step5_QuestionEditor';
import Step6_AgendaBuilder from './components/Step6_AgendaBuilder';
import Step7_Results from './components/Step7_Results';

// Main wizard content (needs to be inside WizardProvider)
function WizardContent() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <Step1_JobInput />;
      case 2:
        return <Step2_CompetencyEditor />;
      case 3:
        return <Step3_RubricEditor />;
      case 4:
        return <Step4_InterviewFocus />;
      case 5:
        return <Step5_QuestionEditor />;
      case 6:
        return <Step6_AgendaBuilder />;
      case 7:
        return <Step7_Results />;
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
