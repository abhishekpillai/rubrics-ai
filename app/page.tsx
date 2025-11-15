'use client';

import { WizardProvider, useWizard } from '@/lib/wizardContext';
import WizardLayout from './components/WizardLayout';
import Step1_JobInput from './components/Step1_JobInput';
import Step2_CompetencyEditor from './components/Step2_CompetencyEditor';

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
        return (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-2">STEP 3: COMING SOON</h2>
            <p className="text-sm opacity-50">Question Editor - In Development</p>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-2">STEP 4: COMING SOON</h2>
            <p className="text-sm opacity-50">Agenda Builder - In Development</p>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-2">STEP 5: COMING SOON</h2>
            <p className="text-sm opacity-50">Rubric Builder - In Development</p>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-2">STEP 6: COMING SOON</h2>
            <p className="text-sm opacity-50">Results & Export - In Development</p>
          </div>
        );
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
