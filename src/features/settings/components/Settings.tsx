import { useState } from 'react';
import type { User } from 'firebase/auth';
import ReauthModal from '../../auth/components/ReauthModal';
import { useAuth } from '../../auth/context/AuthContext';
import TopBar from '../../../shared/components/TopBar/TopBar';
import SettingsForm from './SettingsForm';
import { useSettingsForm } from './useSettingsForm';

export default function Settings() {
  const auth = useAuth();

  if (!auth.currentUser) {
    return null;
  }

  return (
    <SettingsContent
      currentUser={auth.currentUser}
      updateEmail={auth.updateEmail}
      updatePassword={auth.updatePassword}
      updateUser={auth.updateUser}
    />
  );
}

type SettingsContentProps = {
  currentUser: User;
  updateEmail: ReturnType<typeof useAuth>['updateEmail'];
  updatePassword: ReturnType<typeof useAuth>['updatePassword'];
  updateUser: ReturnType<typeof useAuth>['updateUser'];
};

function SettingsContent({
  currentUser,
  updateEmail,
  updatePassword,
  updateUser,
}: SettingsContentProps) {
  const [isReauthVisible, setIsReauthVisible] = useState(false);
  const settingsForm = useSettingsForm({
    currentUser,
    onRequiresRecentLogin: () => setIsReauthVisible(true),
    updateEmail,
    updatePassword,
    updateUser,
  });

  return (
    <main className='min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden bg-app-bg transition-colors lg:min-h-screen dark:bg-app-dark-bg'>
      <div className='mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:py-8'>
        <TopBar title='Settings' profile={currentUser} />
        <SettingsForm
          errors={settingsForm.errors}
          isEditing={settingsForm.isEditing}
          loading={settingsForm.loading}
          onChange={settingsForm.handleChange}
          onEdit={() => settingsForm.setIsEditing(true)}
          onSubmit={settingsForm.handleSubmit}
          values={settingsForm.values}
        />
      </div>
      <ReauthModal
        isVisible={isReauthVisible}
        onClose={() => setIsReauthVisible(false)}
      />
    </main>
  );
}
