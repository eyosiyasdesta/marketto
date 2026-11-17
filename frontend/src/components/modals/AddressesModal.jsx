import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AddressesModal() {
  const { activeModal, closeModal } = useModal();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('sw_addresses');
      return saved ? JSON.parse(saved) : [
        { id: 1, label: 'Home', address: '124 Market Street, New York, NY 10001' }
      ];
    } catch {
      return [];
    }
  });

  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('Home');

  if (activeModal !== 'addresses') return null;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const updated = [
      ...addresses,
      { id: Date.now(), label: newLabel, address: newAddress.trim() }
    ];
    setAddresses(updated);
    localStorage.setItem('sw_addresses', JSON.stringify(updated));
    setNewAddress('');
    showToast('Address added!');
  };

  const handleRemove = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('sw_addresses', JSON.stringify(updated));
    showToast('Address removed.');
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        <button className="close-btn" onClick={closeModal} aria-label="Close">
          ✕
        </button>

        <h2>My Addresses</h2>
        <p className="subtitle">Manage your saved delivery addresses</p>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {addr.label}
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '14px' }}>{addr.address}</p>
              </div>
              <button
                onClick={() => handleRemove(addr.id)}
                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}
                title="Remove address"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddAddress} style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <h4>Add New Address</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginTop: '8px' }}>
            <select value={newLabel} onChange={(e) => setNewLabel(e.target.value)}>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Full address (Street, City, Zip)"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary full-width" style={{ marginTop: '10px' }}>
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
