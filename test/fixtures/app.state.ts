import { AppState } from "../../src/interfaces";
import { create } from "../../src/app.actions";

export const createAppState: () => AppState = () => {
  const appState: AppState = {
    actions: {} as any,
    jobs: {},
    iconTheme: "stencil_dark",
    state: "OK",
  };
  appState.actions = create({
    log: () => {},
    electron: {} as any,
    menubar: {} as any,
    appState,
  });
  return appState;
};
