import "./LayerUI.scss";
import { FixedSideContainer } from "../FixedSideContainer/FixedSideContainer";
import Section from "../Section";
import { Island } from "../Island/Island";
import { ShapesSwitcher } from "../Actions/Actions";
import { UIAppState } from "../../types";
import Stack from "../Stack/Stack";

interface LayerUIProps {
  appState: UIAppState;
}

function LayerUI({ appState }: LayerUIProps) {
  const renderFixedSideContainer = () => {
    return (
      <FixedSideContainer side="top">
        <div className="App-menu App-menu_top">
          <div className="App-menu_top_left"></div>
          <Section heading="shapes" className="shapes-section">
            {(heading) => (
              <div className="relative" style={{ pointerEvents: "all" }}>
                <Island className="App-toolbar">
                  {heading}
                  <Stack.Row gap={1}>
                    <ShapesSwitcher appState={appState} />
                  </Stack.Row>
                </Island>
              </div>
            )}
          </Section>
          <div className="App-menu_top_right"></div>
        </div>
      </FixedSideContainer>
    );
  };

  return <div className="layer-ui__wrapper">{renderFixedSideContainer()}</div>;
}

export default LayerUI;
