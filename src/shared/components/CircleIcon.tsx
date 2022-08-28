import { createIcon } from "@chakra-ui/icon";

export const CircleIcon = createIcon({
  displayName: "CircleIcon",
  path: (
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
    </g>
  ),
});
