import { Dispatch, forwardRef, SetStateAction, useCallback, useEffect, useState } from "react";

import { Input, InputProps } from "./input";

type BadgeInputProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: (value: string[]) => void;
  setPendingKeyword?: Dispatch<SetStateAction<string>>;
  index?: number
};

export const BadgeInput = forwardRef<HTMLInputElement, BadgeInputProps>(
  ({ value = [], onChange, setPendingKeyword, index, ...props }, ref) => {
    const [label, setLabel] = useState(() => {
      if (typeof index !== "undefined" && value.length) return value[index];
      return "";
    });

    const processInput = useCallback(() => {
      if (typeof index !== "undefined") {
        const newLabels = value.splice(index, 1, label)
        onChange([...value, ...newLabels]);
        setLabel("");
      }
      else {
        const newLabels = label
          .split(",")
          .map((str) => str.trim())
          .filter(Boolean)
          .filter((str) => !value.includes(str));
        onChange([...new Set([...value, ...newLabels])]);
        setLabel("");
      }
    }, [label, value, onChange]);

    useEffect(() => {
      if (label?.includes(",")) {
        processInput();
      }
    }, [label, processInput]);

    useEffect(() => {
      if (setPendingKeyword) setPendingKeyword(label);
    }, [label, setPendingKeyword]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && typeof index === 'undefined') {
        event.preventDefault();
        event.stopPropagation();

        processInput();
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={label}
        onKeyDown={onKeyDown}
        onChange={(event) => setLabel(event.target.value)}
      />
    );
  },
);
