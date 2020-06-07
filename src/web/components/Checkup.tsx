import { useReducer } from "preact/hooks";
import clsx from "clsx";
import { FunctionComponent, JSX, h } from "preact";
import { Statuses, StatusesProps } from "./Statuses";
import { AppState } from "../../interfaces";
import { ErrorMessage } from "./ErrorMessage";
import {
  GearIconButton,
  IssueIconButton,
  FileIconButton,
  ThemeIconButton,
} from "./IconButton";
import { Body } from "./Text";
import { initialState, rootReducer } from "../reducers";
import "./Checkup.scss";
import { Themes, toggle } from "../reducers/theme";

export interface CheckupProps {
  onToggleTheme: (theme: Themes) => any;
  onConfigure: JSX.MouseEventHandler<any>;
  onIssue: JSX.MouseEventHandler<any>;
  onOpenLog: JSX.MouseEventHandler<any>;
  onSnooze: StatusesProps["onSnooze"];
  state: {
    main: AppState | null;
  };
}

export const Checkup: FunctionComponent<CheckupProps> = ({
  onConfigure,
  onIssue,
  onOpenLog,
  onToggleTheme,
  onSnooze,
  state: { main },
}) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <div
      className={clsx("checkup", {
        "checkup-dark": state.theme.value === Themes.Dark,
      })}
    >
      <main className="checkup-content">
        {main && main.state === "OK" ? (
          <Statuses
            onSnooze={onSnooze}
            jobs={main ? Object.values(main.jobs) : []}
          />
        ) : (
          <ErrorMessage title="Bad config">
            <Body>
              Bad configuration file detected:{" "}
              {main!.errorMessage || "unknown error"}
            </Body>
          </ErrorMessage>
        )}
      </main>
      <nav className="checkup-controls">
        <IssueIconButton onClick={onIssue} title="Open an issue" />
        <div className="checkup-controls-spacer" />
        <ThemeIconButton
          onClick={(event) => {
            // TODO: Move to middleware
            onToggleTheme(toggle(state.theme.value));
            dispatch({
              payload: null,
              type: "TOGGLE_THEME",
            });
          }}
          theme={state.theme.value}
          title="Change theme"
        />
        <FileIconButton onClick={onOpenLog} title="Open log file" />
        <GearIconButton onClick={onConfigure} title="Configure" />
      </nav>
    </div>
  );
};
