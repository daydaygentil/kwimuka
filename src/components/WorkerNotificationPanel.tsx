
import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, X } from 'lucide-react';
import { ServiceNotification, JobAssignment, Worker } from '@/types/worker';

interface WorkerNotificationPanelProps {
  workerId: string;
  notifications: ServiceNotification[];
  jobAssignments: JobAssignment[];
  onAcceptJob: (jobId: string) => void;
  onDeclineJob: (jobId: string) => void;
  onMarkNotificationRead: (notificationId: string) => void;
}

const WorkerNotificationPanel = ({
  workerId,
  notifications,
  jobAssignments,
  onAcceptJob,
  onDeclineJob,
  onMarkNotificationRead
}: WorkerNotificationPanelProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const activeNotifications = notifications.filter(n => 
    n.workerId === workerId && 
    (!n.expiresAt || new Date() < n.expiresAt)
  );

  useEffect(() => {
    setUnreadCount(activeNotifications.length);
  }, [activeNotifications.length]);

  const getJobAssignment = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    return jobAssignments.find(j => j.id === notification?.jobAssignmentId);
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const diff = expiresAt.getTime() - new Date().getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes > 0 ? `${minutes}m remaining` : 'Expired';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Job Notifications</h3>
          </div>

          {activeNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeNotifications.map((notification) => {
                const jobAssignment = getJobAssignment(notification.id);
                
                return (
                  <div key={notification.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <button
                        onClick={() => onMarkNotificationRead(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {jobAssignment && notification.type === 'job_offer' && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          Service: {jobAssignment.serviceType}
                        </div>
                        
                        {notification.expiresAt && (
                          <div className="flex items-center text-xs text-orange-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeRemaining(notification.expiresAt)}
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => onAcceptJob(jobAssignment.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => onDeclineJob(jobAssignment.id)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerNotificationPanel;
