function generateRandomNumberArray(length, min = 0, max = 100) {
  if (length <= 0) {
    throw new Error("Array length must be greater than 0.");
  }
  if (min > max) {
    throw new Error("Minimum value cannot be greater than the maximum value.");
  }

  const randomArray = Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  return randomArray;
}

export { generateRandomNumberArray };
