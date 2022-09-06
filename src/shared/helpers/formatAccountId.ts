export function formatAccountId(
  accountId: string,
  screenWidth: number
): string {
  const { startLength, endLength, maxLength } = getAccountLengths(screenWidth);
  return accountId.length > maxLength
    ? accountId.slice(0, startLength) +
        ".." +
        (endLength === 0 ? "" : accountId.slice(0 - endLength))
    : accountId;
}

function getAccountLengths(screenWidth: number): {
  startLength: number;
  endLength: number;
  maxLength: number;
} {
  if (screenWidth < 1200) {
    return { startLength: 7, endLength: 7, maxLength: 6 };
  } else {
    return { startLength: 9, endLength: 9, maxLength: 20 };
  }
}
