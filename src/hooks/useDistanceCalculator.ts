
import { useState } from "react";

export const useDistanceCalculator = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  const calculateDistance = async (pickupAddress: string, deliveryAddress: string) => {
    if (!pickupAddress || !deliveryAddress) return;

    setIsCalculatingDistance(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCZ8XQ61lEI0mOm1eQd-6zYkjxGO4R0rQ8`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Calculate the driving distance in kilometers between these two locations in Rwanda:
              From: ${pickupAddress}
              To: ${deliveryAddress}
              
              Please respond with only a number representing the distance in kilometers. If you cannot determine the exact distance, provide a reasonable estimate based on the locations mentioned.`
            }]
          }]
        })
      });

      const data = await response.json();
      const distanceText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const extractedDistance = parseFloat(distanceText?.match(/\d+(\.\d+)?/)?.[0] || "10");
      
      setDistance(extractedDistance);
    } catch (error) {
      console.error('Error calculating distance:', error);
      setDistance(10); // Fallback to a default distance
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  return {
    distance,
    isCalculatingDistance,
    calculateDistance
  };
};
