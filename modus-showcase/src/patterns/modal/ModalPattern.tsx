// @ts-nocheck
import { ModusWcButton, ModusWcModal, ModusWcTextInput, ModusWcTypography, ModusWcInputLabel } from '@trimble-oss/moduswebcomponents-react';

export function BasicModal() {
  const modalId = 'pattern-example-modal';

  const handleOpenModal = () => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <ModusWcButton onButtonClick={handleOpenModal}>Open Modal</ModusWcButton>
      <ModusWcModal modalId={modalId} customClass="sm:max-w-[425px]">
        <ModusWcTypography slot="header" hierarchy="h2" size="lg" weight="semibold" label="Edit Profile" />
        <div slot="content" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <ModusWcInputLabel forId="name" labelText="Name" customClass="text-right" />
            <ModusWcTextInput
              id="name"
              value="John Doe"
              customClass="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <ModusWcInputLabel forId="email" labelText="Email" customClass="text-right" />
            <ModusWcTextInput
              id="email"
              value="john@example.com"
              customClass="col-span-3"
            />
          </div>
        </div>
        <div slot="footer" className="flex justify-end space-x-2">
          <ModusWcButton variant="outlined" color="tertiary" onButtonClick={handleCloseModal}>Cancel</ModusWcButton>
          <ModusWcButton onButtonClick={handleCloseModal}>Save Changes</ModusWcButton>
        </div>
      </ModusWcModal>
    </>
  );
}

export default BasicModal;
