import { t } from "@swell-draw/swellDraw/i18n";
import { UIAppState } from "../../types";
import { SHAPES } from "../shapes";
import ToolButton from "../ToolButton/ToolButton";
import { capitalizeString } from "@swell-draw/common";

export const ShapesSwitcher = ({ appState }: { appState: UIAppState }) => {
  return (
    <>
      {SHAPES.map(({ value, icon }) => {
        const label = t(`toolBar.${value}`);

        return (
          <ToolButton
            key={value}
            icon={icon}
            aria-label={capitalizeString(label)}
            type="radio"
            checked={appState.activeTool.type === value}
            onChange={() => {
              appState.activeTool = {
                type: value,
                customType: null,
              };
            }}
            onPointerDown={() => {
              appState.activeTool = {
                type: value,
                customType: null,
              };
            }}
          />
        );
      })}
    </>
  );
};
