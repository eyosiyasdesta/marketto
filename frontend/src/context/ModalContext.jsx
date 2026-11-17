import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // 'detail' | 'checkout' | 'orders' | 'dashboard' | 'addresses' | null
  const [modalData, setModalData] = useState(null);

  const openModal = (name, data = null) => {
    setActiveModal(name);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}
