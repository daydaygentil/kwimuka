
import { useState } from "react";
import { Settings, Send, UserPlus, Edit, MessageSquare, Bell } from "lucide-react";
import { UserAccount } from '@/types/worker';

interface AdminSettingsProps {
  userAccounts: UserAccount[];
  onUpdateUserAccounts: (accounts: UserAccount[]) => void;
  onSendSMS: (phone: string, message: string) => void;
  onSendNotification: (userId: string, message: string, type: 'email' | 'push' | 'sms') => void;
}

const AdminSettings = ({ userAccounts, onUpdateUserAccounts, onSendSMS, onSendNotification }: AdminSettingsProps) => {
  const [activeTab, setActiveTab] = useState<'sms' | 'notifications' | 'users' | 'add-user'>('sms');
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [notificationUserId, setNotificationUserId] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<'email' | 'push' | 'sms'>('sms');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    password: "",
    role: "customer" as "customer" | "driver" | "helper" | "cleaner" | "admin"
  });

  const handleSendSMS = () => {
    if (smsPhone && smsMessage) {
      onSendSMS(smsPhone, smsMessage);
      setSmsPhone("");
      setSmsMessage("");
      alert("SMS sent successfully!");
    }
  };

  const handleSendNotification = () => {
    if (notificationUserId && notificationMessage) {
      onSendNotification(notificationUserId, notificationMessage, notificationType);
      setNotificationUserId("");
      setNotificationMessage("");
      alert("Notification sent successfully!");
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.phone && newUser.password) {
      const user: UserAccount = {
        id: `user_${Date.now()}`,
        name: newUser.name,
        phone: newUser.phone,
        password: newUser.password,
        role: newUser.role,
        createdAt: new Date()
      };
      
      onUpdateUserAccounts([...userAccounts, user]);
      setNewUser({ name: "", phone: "", password: "", role: "customer" });
      alert("User added successfully!");
    }
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      const updatedAccounts = userAccounts.map(user => 
        user.id === editingUser.id ? editingUser : user
      );
      onUpdateUserAccounts(updatedAccounts);
      setEditingUser(null);
      alert("User updated successfully!");
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedAccounts = userAccounts.filter(user => user.id !== userId);
      onUpdateUserAccounts(updatedAccounts);
      alert("User deleted successfully!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('sms')}
            className={`py-4 border-b-2 font-medium text-sm ${
              activeTab === 'sms'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Send SMS
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('add-user')}
            className={`py-4 border-b-2 font-medium text-sm ${
              activeTab === 'add-user'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Add User
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'sms' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Send SMS to Any User</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="+250 788 123 456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendSMS}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send SMS</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Send Notification</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={notificationUserId}
                  onChange={(e) => setNotificationUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a user...</option>
                  {userAccounts.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.phone}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as 'email' | 'push' | 'sms')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>Send Notification</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAccounts.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add-user' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+250 788 123 456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="helper">Helper</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="helper">Helper</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateUser}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
