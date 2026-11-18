import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '@/api';
import { toast } from 'sonner';

const Context = createContext(null);
const readUser = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('sw_user') || 'null');
    return saved ? { ...saved, name: saved.name || saved.fullName || '', displayName: saved.displayName || saved.name || saved.fullName || '' } : null;
  } catch { return null; }
};
export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(readUser);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('marketto-wishlist') || '[]'); } catch { return []; }
  });
  const [ready, setReady] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem('sw_token')) { setCart([]); return; }
    try { setCart(await api.getCart()); } catch (error) { console.error('Could not load cart', error); }
  }, []);
  useEffect(() => {
    refreshCart().finally(() => setReady(true));
  }, [refreshCart, user]);

  const action = async (fn) => {
    try { setCart(await fn()); return true; }
    catch (error) { toast.error(error.message || 'That action could not be completed.'); return false; }
  };
  const add = async (id, qty = 1, variant = '') => {
    if (!localStorage.getItem('sw_token')) { toast.error('Please sign in before adding items to your bag.'); return false; }
    const ok = await action(() => api.addToCart(id, qty, variant));
    if (ok) toast.success('A good choice. Added to your bag.');
    return ok;
  };
  const toggleWish = (id) => setWishlist((old) => {
    const next = old.includes(id) ? old.filter((x) => x !== id) : [...old, id];
    localStorage.setItem('marketto-wishlist', JSON.stringify(next));
    return next;
  });
  const authenticate = async (mode, data) => {
    const account = mode === 'register' ? await api.register(data) : await api.login(data);
    setUser(account);
    localStorage.setItem('sw_user', JSON.stringify(account));
    return account;
  };
  const signOut = () => {
    api.logout();
    localStorage.removeItem('sw_user');
    setUser(null);
    setCart([]);
    toast.success('You are signed out.');
  };
  const placeOrder = async (address) => {
    const order = await api.checkout(address);
    setCart([]);
    return order;
  };
  const saveProfile = async (profile) => {
    const saved = await api.updateProfile(profile);
    const updated = { ...user, ...saved };
    setUser(updated);
    localStorage.setItem('sw_user', JSON.stringify(updated));
    toast.success('Profile details saved on this device.');
  };
  return <Context.Provider value={{
    cart, user, wishlist, ready, add, toggleWish, authenticate, signOut, placeOrder, saveProfile,
    update: (id, quantity) => action(() => api.updateCart(id, quantity)),
    remove: (id) => action(() => api.removeFromCart(id)),
  }}>{children}</Context.Provider>;
}
export function useStore() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Store provider is missing');
  return ctx;
}
