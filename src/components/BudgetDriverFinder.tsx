
import { useState } from "react";
import { DollarSign, MapPin, User, Phone } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  minBudget: number;
  distance: number;
}

interface BudgetDriverFinderProps {
  userBudget: number;
  estimatedPrice: number;
  onDriverSelect: (driver: Driver) => void;
}

const BudgetDriverFinder = ({ userBudget, estimatedPrice, onDriverSelect }: BudgetDriverFinderProps) => {
  const [showBudgetDrivers, setShowBudgetDrivers] = useState(false);

  // Mock nearby drivers willing to accept lower budgets
  const budgetDrivers: Driver[] = [
    { id: 'budget1', name: 'James Uwimana', phone: '+250 788 111 001', rating: 4.2, minBudget: userBudget * 0.9, distance: 2.1 },
    { id: 'budget2', name: 'Grace Mukamana', phone: '+250 788 111 002', rating: 4.0, minBudget: userBudget * 0.85, distance: 3.5 },
    { id: 'budget3', name: 'Patrick Nkurunziza', phone: '+250 788 111 003', rating: 3.8, minBudget: userBudget * 0.8, distance: 4.2 },
  ].filter(driver => driver.minBudget <= userBudget);

  if (userBudget >= estimatedPrice) {
    return null; // Don't show if budget is sufficient
  }

  return (
    <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
      <div className="flex items-center mb-4">
        <DollarSign className="h-5 w-5 text-orange-600 mr-2" />
        <h3 className="font-semibold text-orange-800">Budget-Friendly Options</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-orange-700">
          Your budget: <span className="font-bold">{userBudget.toLocaleString()} RWF</span>
        </p>
        <p className="text-orange-700">
          Estimated price: <span className="font-bold">{estimatedPrice.toLocaleString()} RWF</span>
        </p>
        <p className="text-sm text-orange-600 mt-2">
          We found {budgetDrivers.length} nearby drivers willing to work within your budget!
        </p>
      </div>

      <button
        onClick={() => setShowBudgetDrivers(!showBudgetDrivers)}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors mb-4"
      >
        {showBudgetDrivers ? 'Hide Budget Drivers' : 'Show Budget Drivers'}
      </button>

      {showBudgetDrivers && (
        <div className="space-y-3">
          {budgetDrivers.map((driver) => (
            <div key={driver.id} className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{driver.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 mr-1" />
                      {driver.phone}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-bold text-orange-600">★ {driver.rating}</div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {driver.distance} km away
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Accepts: </span>
                  <span className="font-bold text-green-600">
                    {driver.minBudget.toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDriverSelect(driver)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Select This Driver
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetDriverFinder;
