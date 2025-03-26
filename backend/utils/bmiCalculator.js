export const calculateBMI = (weight, height) => {
  if (!weight || !height || height <= 0) {
    throw new Error("Invalid height or weight");
  }

  // Convert height from cm to meters
  const heightInMeters = height / 100;

  // BMI Formula: weight (kg) / height (m)^2
  const bmi = weight / (heightInMeters * heightInMeters);

  return parseFloat(bmi.toFixed(2)); // Convert string to float
};
