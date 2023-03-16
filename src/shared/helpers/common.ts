export const isNumberValid = (number: any): boolean => {
  return Boolean(number !== null && number !== undefined);
};

export const isObjectInArray = (
  arrayToCheck: any,
  valueToFind: any
): boolean => {
  if (Array.isArray(arrayToCheck)) {
    return Boolean(arrayToCheck.find((i) => i === valueToFind));
  }
  return false;
};

export const getWinnerData = (winnerDetails: any) => {
  let result: string = "";
  let winnerId: string = "";
  if (typeof winnerDetails === "object") {
    const data = Object.keys(winnerDetails);
    result = data[0];
    winnerId = winnerDetails[data[0]] ?? "";
  }
  return { result, winnerId };
};
