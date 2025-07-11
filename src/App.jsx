import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBvjmAXtdVg_Y2naXwBNoWu6DKpElCeGw",
  authDomain: "stocksyncpro-junior.firebaseapp.com",
  projectId: "stocksyncpro-junior",
  storageBucket: "stocksyncpro-junior.firebasestorage.app",
  messagingSenderId: "804994599728",
  appId: "1:804994599728:web:a51ad1f9a4d051aab316f5",
  measurementId: "G-P78KKFYN1R"
};

// These variables are typically provided by the Canvas environment for dynamic app IDs and auth tokens.
// For a local setup, we'll use a default 'appId' if __app_id is not defined.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'stocksync-pro-local-app';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Context for Firebase and User
const FirebaseContext = createContext(null);

// Utility function for a simple modal/toast
const showMessage = (message, type = 'info') => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `p-3 mb-2 rounded-lg shadow-md text-white ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};


// --- Firebase Provider Component ---
function FirebaseProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(auth, initialAuthToken);
            console.log('Signed in with custom token.');
          } catch (customTokenError) {
            console.error('Custom token sign-in failed:', customTokenError);
            // Fallback to anonymous sign-in if custom token fails
            console.log('Attempting anonymous sign-in as fallback.');
            await signInAnonymously(auth);
          }
        } else {
          await signInAnonymously(auth);
          console.log('Signed in anonymously (no custom token provided).');
        }
        setFirebaseInitialized(true);
      } catch (error) {
        console.error('Firebase authentication failed (general error):', error);
        showMessage('Failed to initialize Firebase. Please try again.', 'error');
      }
    };

    initFirebase();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady || !firebaseInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Initializing Firebase...</div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={{ db, auth, userId, appId }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// --- Product Management (API Simulation) ---
const ProductService = () => {
  const { db, userId, appId } = useContext(FirebaseContext);
  // Data stored under /artifacts/{appId}/users/{userId}/products
  const productsCollection = collection(db, `artifacts/${appId}/users/${userId}/products`);

  const addProduct = async (product) => {
    try {
      const docRef = await addDoc(productsCollection, {
        ...product,
        stock: Number(product.stock),
        minStockThreshold: Number(product.minStockThreshold),
        lastUpdated: serverTimestamp(),
      });
      showMessage('Product added successfully!', 'success');
      return docRef.id;
    } catch (e) {
      console.error('Error adding product:', e);
      showMessage('Error adding product.', 'error');
      return null;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const productRef = doc(db, `artifacts/${appId}/users/${userId}/products`, id);
      await updateDoc(productRef, {
        ...updates,
        stock: Number(updates.stock),
        minStockThreshold: Number(updates.minStockThreshold),
        lastUpdated: serverTimestamp(),
      });
      showMessage('Product updated successfully!', 'success');
    } catch (e) {
      console.error('Error updating product:', e);
      showMessage('Error updating product.', 'error');
    }
  };

  const deleteProduct = async (id) => {
    try {
      const productRef = doc(db, `artifacts/${appId}/users/${userId}/products`, id);
      await deleteDoc(productRef);
      showMessage('Product deleted successfully!', 'success');
    } catch (e) {
      console.error('Error deleting product:', e);
      showMessage('Error deleting product.', 'error');
    }
  };

  const getProducts = (setProducts) => {
    const q = query(productsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    }, (error) => {
      console.error('Error fetching products:', error);
      showMessage('Error fetching products.', 'error');
    });
    return unsubscribe;
  };

  return { addProduct, updateProduct, deleteProduct, getProducts };
};

// --- Order Management (Simulated Webhook Receiver) ---
const OrderService = () => {
  const { db, userId, appId } = useContext(FirebaseContext);
  // Data stored under /artifacts/{appId}/users/{userId}/orders
  const ordersCollection = collection(db, `artifacts/${appId}/users/${userId}/orders`);

  // Simulate a supplier sending a webhook to update order status
  const simulateSupplierWebhook = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, `artifacts/${appId}/users/${userId}/orders`, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastStatusUpdate: serverTimestamp(),
      });
      showMessage(`Webhook received: Order ${orderId} status updated to ${newStatus}!`, 'info');
    } catch (e) {
      console.error('Error simulating webhook for order:', e);
      showMessage('Error simulating webhook for order.', 'error');
    }
  };

  const addOrder = async (order) => {
    try {
      const docRef = await addDoc(ordersCollection, {
        ...order,
        orderDate: serverTimestamp(),
        lastStatusUpdate: serverTimestamp(),
      });
      showMessage('Order created successfully!', 'success');
      return docRef.id;
    } catch (e) {
      console.error('Error adding order:', e);
      showMessage('Error adding order.', 'error');
      return null;
    }
  };

  const getOrders = (setOrders) => {
    const q = query(ordersCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    }, (error) => {
      console.error('Error fetching orders:', error);
      showMessage('Error fetching orders.', 'error');
    });
    return unsubscribe;
  };

  return { simulateSupplierWebhook, addOrder, getOrders };
};

// --- Notification Service (Internal Webhook Trigger) ---
const NotificationService = () => {
  const { db, userId, appId } = useContext(FirebaseContext);
  // Data stored under /artifacts/{appId}/users/{userId}/notifications
  const notificationsCollection = collection(db, `artifacts/${appId}/users/${userId}/notifications`);

  // This function simulates an internal webhook trigger for low stock
  const triggerLowStockAlert = async (productId, productName, currentStock, minThreshold) => {
    try {
      await addDoc(notificationsCollection, {
        type: 'low_stock',
        productId,
        message: `Low stock alert! ${productName} (SKU: ${productId}) is at ${currentStock} units, below threshold of ${minThreshold}.`,
        timestamp: serverTimestamp(),
        read: false,
      });
      showMessage('Low stock alert triggered!', 'warning');
    } catch (e) {
      console.error('Error triggering low stock alert:', e);
      showMessage('Error triggering low stock alert.', 'error');
    }
  };

  const getNotifications = (setNotifications) => {
    const q = query(notificationsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationsData.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())); // Sort by newest
    }, (error) => {
      console.error('Error fetching notifications:', error);
      showMessage('Error fetching notifications.', 'error');
    });
    return unsubscribe;
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, `artifacts/${appId}/users/${userId}/notifications`, notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  return { triggerLowStockAlert, getNotifications, markNotificationAsRead };
};

// --- UI Components ---

const ProductForm = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [sku, setSku] = useState(product ? product.sku : '');
  const [stock, setStock] = useState(product ? product.stock : 0);
  const [minStockThreshold, setMinStockThreshold] = useState(product ? product.minStockThreshold : 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !sku) {
      showMessage('Product name and SKU are required.', 'error');
      return;
    }
    onSave({ name, sku, stock: Number(stock), minStockThreshold: Number(minStockThreshold) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Current Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="minStockThreshold" className="block text-sm font-medium text-gray-700">Min Stock Threshold</label>
            <input
              type="number"
              id="minStockThreshold"
              value={minStockThreshold}
              onChange={(e) => setMinStockThreshold(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min="0"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductList = ({ products, onEdit, onDelete, onAdjustStock, triggerLowStockAlert }) => {
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);

  const handleAdjustClick = (product) => {
    setSelectedProduct(product);
    setStockAdjustment(0); // Reset adjustment
    setShowAdjustStockModal(true);
  };

  const handleAdjustStockSave = async () => {
    if (selectedProduct && stockAdjustment !== 0) {
      const newStock = Math.max(0, Number(selectedProduct.stock) + Number(stockAdjustment));
      await onAdjustStock(selectedProduct.id, { stock: newStock });

      // Check for low stock after adjustment
      if (newStock < selectedProduct.minStockThreshold) {
        triggerLowStockAlert(selectedProduct.id, selectedProduct.name, newStock, selectedProduct.minStockThreshold);
      }
    }
    setShowAdjustStockModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Inventory</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No products yet. Add some!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className={`${product.stock < product.minStockThreshold ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                    {product.stock < product.minStockThreshold && (
                      <span className="ml-2 text-red-600 text-xs font-semibold"> (LOW!)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.minStockThreshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.lastUpdated?.toDate().toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAdjustClick(product)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Adjust Stock
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdjustStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Adjust Stock for {selectedProduct.name}</h2>
            <div className="mb-4">
              <p className="text-gray-700">Current Stock: <span className="font-semibold">{selectedProduct.stock}</span></p>
              <label htmlFor="stockAdjustment" className="block text-sm font-medium text-gray-700 mt-2">Adjustment Quantity (e.g., +5 for incoming, -2 for outgoing)</label>
              <input
                type="number"
                id="stockAdjustment"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAdjustStockModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdjustStockSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderList = ({ orders, simulateSupplierWebhook }) => {
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleSimulateClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); // Pre-fill with current status
    setShowSimulateModal(true);
  };

  const handleSimulateWebhookSave = async () => {
    if (selectedOrder && newStatus) {
      await simulateSupplierWebhook(selectedOrder.id, newStatus);
    }
    setShowSimulateModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Supplier Orders (Webhook Simulation)</h2>
      <button
        onClick={() => showMessage('This simulates a webhook from a supplier when an order status changes. Your backend would receive this and update Firestore.', 'info')}
        className="mb-4 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
      >
        What is this?
      </button>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet. Add a simulated order below.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status Update</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate?.toDate().toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.lastStatusUpdate?.toDate().toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSimulateClick(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Simulate Webhook Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSimulateModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Simulate Webhook for Order {selectedOrder.id}</h2>
            <div className="mb-4">
              <p className="text-gray-700">Current Status: <span className="font-semibold">{selectedOrder.status}</span></p>
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mt-2">New Status</label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateWebhookSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply Webhook Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationDisplay = ({ notifications, markNotificationAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications ({unreadCount} unread)</h2>
      <button
        onClick={() => showMessage('This simulates an internal webhook-like trigger for alerts, like low stock. Your system would generate this event and send it to a notification service.', 'info')}
        className="mb-4 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
      >
        What is this?
      </button>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <div className="max-h-60 overflow-y-auto pr-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 mb-2 rounded-md ${notification.read ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-800 font-semibold'} flex justify-between items-center`}
            >
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.timestamp?.toDate().toLocaleString() || 'N/A'}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="ml-4 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-md"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
function App() {
  const { userId, appId } = useContext(FirebaseContext);
  const { addProduct, updateProduct, deleteProduct, getProducts } = ProductService();
  const { simulateSupplierWebhook, addOrder, getOrders } = OrderService();
  const { triggerLowStockAlert, getNotifications, markNotificationAsRead } = NotificationService();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'notifications'

  useEffect(() => {
    // Listen for product changes (API-driven data)
    const unsubscribeProducts = getProducts(setProducts);
    // Listen for order changes (Webhook-driven data)
    const unsubscribeOrders = getOrders(setOrders);
    // Listen for notification changes (Internal webhook-driven alerts)
    const unsubscribeNotifications = getNotifications(setNotifications);

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeNotifications();
    };
  }, [userId]); // Re-run effect if userId changes (e.g., after auth init)

  const handleAddProduct = (product) => {
    addProduct(product);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCloseProductForm = () => {
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleAddSimulatedOrder = async () => {
    if (products.length === 0) {
      showMessage('Please add some products first to create an order.', 'info');
      return;
    }
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const orderId = await addOrder({
      productId: randomProduct.id,
      productName: randomProduct.name,
      quantity: Math.floor(Math.random() * 10) + 1, // 1-10 units
      status: 'pending',
    });
    if (orderId) {
      showMessage(`Simulated order for ${randomProduct.name} created! ID: ${orderId}`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col items-center p-4 sm:p-6">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          /* Custom scrollbar for notification display */
          .max-h-60::-webkit-scrollbar {
            width: 8px;
          }
          .max-h-60::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .max-h-60::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .max-h-60::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
      <div id="toast-container" className="fixed top-4 right-4 z-[100]"></div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Changed the title here */}
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2">StockSync Pro by Junior</h1>
        <p className="text-center text-gray-600 mb-4">Real-time Inventory Management with Webhooks & APIs</p>
        <p className="text-center text-sm text-gray-500">
          Logged in as: <span className="font-mono text-blue-500 break-all">{userId || 'N/A'}</span> (Anonymous User)
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-around border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'inventory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('orders')}
          >
            Supplier Orders
          </button>
          <button
            className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Alerts
          </button>
        </div>

        {activeTab === 'inventory' && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowProductForm(true)}
                className="px-6 py-3 rounded-md shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Add New Product (API)
              </button>
            </div>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={deleteProduct}
              onAdjustStock={updateProduct}
              triggerLowStockAlert={triggerLowStockAlert}
            />
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleAddSimulatedOrder}
                className="px-6 py-3 rounded-md shadow-md text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Add Simulated Order (API)
              </button>
            </div>
            <OrderList
              orders={orders}
              simulateSupplierWebhook={simulateSupplierWebhook}
            />
          </>
        )}

        {activeTab === 'notifications' && (
          <NotificationDisplay
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
          />
        )}
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseProductForm}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

// Wrap the App with FirebaseProvider
export default function WrappedApp() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}
