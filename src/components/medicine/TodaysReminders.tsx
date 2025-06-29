import React from 'react';
import { CheckCircle, XCircle, Clock, Pill, Utensils, AlertCircle } from 'lucide-react';
import { Medicine, MedicineReminder } from '../../types/medicine';

interface TodaysRemindersProps {
  reminders: MedicineReminder[];
  medicines: Medicine[];
  onMarkTaken: (reminderId: string) => void;
  onMarkMissed: (reminderId: string) => void;
}

export function TodaysReminders({ reminders, medicines, onMarkTaken, onMarkMissed }: TodaysRemindersProps) {
  const getMedicine = (medicineId: string) => medicines.find(m => m.id === medicineId);

  const getStatusColor = (status: MedicineReminder['status']) => {
    switch (status) {
      case 'taken':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'missed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'skipped':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusIcon = (status: MedicineReminder['status']) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={20} />;
      case 'missed':
        return <XCircle className="text-red-600 dark:text-red-400" size={20} />;
      case 'skipped':
        return <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={20} />;
      default:
        return <Clock className="text-blue-600 dark:text-blue-400" size={20} />;
    }
  };

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const completedReminders = reminders.filter(r => r.status !== 'pending');

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <Pill className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Reminders Today
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add medicines to get personalized reminders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
            Pending Reminders ({pendingReminders.length})
          </h3>
          
          <div className="space-y-3">
            {pendingReminders.map((reminder) => {
              const medicine = getMedicine(reminder.medicineId);
              if (!medicine) return null;

              const isOverdue = reminder.scheduledTime < new Date();

              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isOverdue 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 ring-2 ring-red-500/20' 
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Pill className={isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} size={20} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {medicine.name}
                        </h4>
                        {isOverdue && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Dosage:</strong> {medicine.dosage} {medicine.unit}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Time:</strong> {reminder.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        
                        {medicine.timing !== 'anytime' && (
                          <div className="flex items-center space-x-2">
                            <Utensils size={14} className="text-orange-600 dark:text-orange-400" />
                            <span className="text-orange-700 dark:text-orange-300 text-xs">
                              {medicine.timing === 'before_meal' && `${medicine.timingOffset || 0}min before ${medicine.mealType?.replace('_', ' ')}`}
                              {medicine.timing === 'after_meal' && `${medicine.timingOffset || 0}min after ${medicine.mealType?.replace('_', ' ')}`}
                              {medicine.timing === 'with_meal' && `With ${medicine.mealType?.replace('_', ' ')}`}
                              {medicine.timing === 'empty_stomach' && 'On empty stomach'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onMarkTaken(reminder.id)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={16} />
                      <span>Mark Taken</span>
                    </button>
                    
                    <button
                      onClick={() => onMarkMissed(reminder.id)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={16} />
                      <span>Mark Missed</span>
                    </button>
                  </div>

                  {/* Medicine Notes */}
                  {medicine.notes && (
                    <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Note:</strong> {medicine.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's History ({completedReminders.length})
          </h3>
          
          <div className="space-y-2">
            {completedReminders.map((reminder) => {
              const medicine = getMedicine(reminder.medicineId);
              if (!medicine) return null;

              return (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-xl border ${getStatusColor(reminder.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(reminder.status)}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {medicine.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {medicine.dosage} {medicine.unit} • {reminder.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium capitalize ${
                        reminder.status === 'taken' ? 'text-green-700 dark:text-green-300' :
                        reminder.status === 'missed' ? 'text-red-700 dark:text-red-300' :
                        'text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {reminder.status}
                      </div>
                      {reminder.actualTime && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          at {reminder.actualTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Today's Summary</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {reminders.filter(r => r.status === 'taken').length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Taken</div>
          </div>
          
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {reminders.filter(r => r.status === 'missed').length}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">Missed</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {pendingReminders.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}