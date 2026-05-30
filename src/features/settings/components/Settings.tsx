import { useState } from 'react';
import type { User } from 'firebase/auth';
import ReauthModal from '../../auth/components/ReauthModal';
import { useAuth } from '../../auth/context/AuthContext';
import TopBar from '../../../shared/components/TopBar/TopBar';
import SettingsForm from './SettingsForm';
import { useSettingsForm } from './useSettingsForm';
import './settings.css';

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
    <main>
      <div className='settings-container'>
        <TopBar title='Settings' />
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
