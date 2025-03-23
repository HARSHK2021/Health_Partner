export const calculateBMI = (weight,height)=>{
    if (!weight || !height || height <= 0) {
        throw new Error("Invalid height or weight");
      }
      const bmi = weight / (height * height);
      return bmi.toFixed(2);
}

