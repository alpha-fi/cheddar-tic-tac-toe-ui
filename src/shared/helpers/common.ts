export const isGameIDValid = (game_id: any): boolean => {
  return Boolean(game_id !== null && game_id !== undefined);
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
