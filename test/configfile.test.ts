import { reload } from "../src/configure";
import ava, { TestInterface } from "ava";
import { AppState } from "../src/interfaces";
import { createAppState } from "./fixtures/app.state";
import { resolve } from "path";

const test = ava as TestInterface<{
  appState: AppState;
  configFilename: string;
}>;

test.beforeEach((t) => {
  t.context.appState = createAppState();
  t.context.configFilename = resolve(__dirname, "../src/configure.template.ts");
});

test("can reload valid configuration file", async (t) => {
  const { appState, configFilename } = t.context;
  await reload({
    appState,
    configFilename,
    log: () => {},
  });
  t.truthy(Object.values(appState.jobs).length, "jobs instantiated");
  t.truthy(appState.jobs["my-api-status"].state.status, "job has a status");
});
