import { t } from "@swell-draw/swellDraw/i18n";
import { AppClassProperties, UIAppState } from "../../types";
import { SHAPES } from "../shapes";
import ToolButton from "../ToolButton/ToolButton";
import { capitalizeString } from "@swell-draw/common";

export const ShapesSwitcher = ({
  appState,
  app,
}: {
  appState: UIAppState;
  app: AppClassProperties;
}) => {
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
              if (appState.activeTool.type === value) {
                return;
              }

              app.setActiveTool({ type: value });
            }}
            onPointerDown={() => {}}
          />
        );
      })}
    </>
  );
};
