const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Single-Hotel Constant ────────────────────────────────────────────────────
export const HOTEL_ID = 'theluxuryinn';

const getAuthToken = () => {
  const adminSession = localStorage.getItem('hotel_admin_session_v1');
  if (adminSession) {
    const admin = JSON.parse(adminSession);
    if (admin.token) return admin.token;
  }
  const userSession = localStorage.getItem('hotel_user_session_v1');
  if (userSession) {
    const user = JSON.parse(userSession);
    if (user.token) return user.token;
  }
  return null;
};

const privateFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return { error: errorData.message || 'API Error', status: response.status };
  }

  return response.json();
};

// ─── Rooms ────────────────────────────────────────────────────────────────────

// Fetch all rooms for the single hotel (public, no auth needed)
export const getRooms = async () => {
  const response = await fetch(`${API_URL}/rooms/${HOTEL_ID}`);
  if (!response.ok) return [];
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map(r => ({ ...r, id: r._id || r.id }));
};

// Save (create or update) a room — admin only
export const saveRoom = async (roomData) => {
  return privateFetch(`${API_URL}/rooms/${HOTEL_ID}`, {
    method: 'POST',
    body: JSON.stringify(roomData)
  });
};

// Delete a room by its MongoDB _id — admin only
export const deleteRoom = async (id) => {
  return privateFetch(`${API_URL}/rooms/${id}`, {
    method: 'DELETE'
  });
};

// Lookup a single room by its _id from the full rooms list
export const getRoomById = async (id) => {
  const rooms = await getRooms();
  return rooms.find(r => r._id === id || String(r.id) === String(id));
};

// ─── Availability ─────────────────────────────────────────────────────────────

// Returns all rooms with an isAvailable flag for the given date range.
// Backend route: GET /api/bookings/availability/:hotelId?checkIn=&checkOut=
export const getAvailableRoomsByCategory = async (checkIn, checkOut) => {
  try {
    const response = await fetch(
      `${API_URL}/bookings/availability/${HOTEL_ID}?checkIn=${checkIn}&checkOut=${checkOut}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map(r => ({ ...r, id: r._id || r.id }));
  } catch (err) {
    console.error('[getAvailableRoomsByCategory] Error:', err);
    return [];
  }
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getBookings = async () => {
  const data = await privateFetch(`${API_URL}/bookings?hotelId=${HOTEL_ID}`);
  if (data.error || !Array.isArray(data)) return [];
  return data;
};

export const getBookingById = async (id) => {
  return privateFetch(`${API_URL}/bookings/${id}`);
};

export const getUserBookings = async (phoneNumber) => {
  const data = await privateFetch(`${API_URL}/bookings?phone=${phoneNumber}`);
  if (data.error || !Array.isArray(data)) return [];
  return data.filter(b => b.phone === phoneNumber);
};

export const createBooking = async (bookingData) => {
  return privateFetch(`${API_URL}/bookings`, {
    method: 'POST',
    body: JSON.stringify({ ...bookingData, hotelId: HOTEL_ID })
  });
};

export const deleteBooking = async (id) => {
  return privateFetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE'
  });
};

export const updateBooking = async (id, data) => {
  return privateFetch(`${API_URL}/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

// ─── Auth ───────────────────────────────────────────────────────────────────────
export const verifyOtpApi = async (phone, otp, mode, name) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, mode, name })
  });
  return response.json();
};

export const adminLoginApi = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

// Fetch logged-in user's profile from MongoDB
export const getUserProfile = async () => {
  return privateFetch(`${API_URL}/auth/me`);
};

// Update logged-in user's name in MongoDB
export const updateUserName = async (name) => {
  return privateFetch(`${API_URL}/auth/me`, {
    method: 'PATCH',
    body: JSON.stringify({ name })
  });
};

// ─── Cart (LocalStorage) ──────────────────────────────────────────────────────
const CART_KEY = 'hotel_selection_cart_v1';

export const getCart = () => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToCart = (room) => {
  const cart = getCart();
  const existing = cart.find(item => item._id === room._id || item.id === room.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...room, quantity: 1, hotelId: HOTEL_ID });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return cart;
};

export const removeFromCart = (roomId) => {
  const cart = getCart();
  const updated = cart.filter(item => item._id !== roomId && item.id !== roomId);
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('cart-updated'));
  return updated;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
};

export const updateCartQuantity = (roomId, newQuantity) => {
  const cart = getCart();
  if (newQuantity <= 0) return removeFromCart(roomId);
  const updated = cart.map(item =>
    (item._id === roomId || item.id === roomId) ? { ...item, quantity: newQuantity } : item
  );
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('cart-updated'));
  return updated;
};
