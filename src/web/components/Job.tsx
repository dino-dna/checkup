import { Fragment, FunctionComponent, JSX, h } from "preact";
import moment from "moment";
import clsx from "clsx";
import { Body, Caption, Code } from "./Text";
import { Job as JobInterface } from "../../interfaces";
import "./Job.scss";
import { isDev } from "../../env";
const snoozeUrl = require("../img/snooze/snooze.png");
require("dragscroll");

export interface JobProps extends JSX.HTMLAttributes {
  job: JobInterface;
  onSnooze: (jobName: string) => void;
}

const getNextRunEstimate = (nextRunDate?: string) =>
  nextRunDate
    ? moment
        .duration(
          moment(nextRunDate).toDate().getTime() - new Date().getTime(),
          "ms"
        )
        .humanize()
    : "?";

const hideActionMenu = (evt: MouseEvent) => {
  let parent: Element = (evt as any).currentTarget!.parentElement;
  while (parent) {
    parent.scrollTo({ left: 0, behavior: "smooth" });
    parent = parent.parentElement!;
  }
};

export const Job: FunctionComponent<JobProps> = ({
  className,
  onSnooze,
  job: {
    name,
    state: { message, nextRunDate, status, snoozedUntilIsoStr },
  },
  ...rest
}) => {
  const actions = {
    isSnoozeActionVisible: isDev || status !== "ok",
  };
  const actionCount = Object.values(actions).filter((i) => i).length;
  return (
    <div
      className={clsx("Job", className, `Job-action-count-${actionCount}`, {
        dragscroll: actionCount > 0,
      })}
      {...rest}
    >
      <div
        className={clsx("Job-icon", {
          "Job-icon-ok": status === "ok",
          "Job-icon-error": status === "not_ok",
          "Job-icon-progress": status === "pending",
        })}
      >
        <i
          className={clsx({
            "icono-cup": status === "snoozed",
            "icono-checkCircle": status === "ok",
            "icono-crossCircle": status === "not_ok",
            "icono-sync": status === "pending",
          })}
        />
      </div>
      <div className="Job-content">
        <div className="Job-content-top">
          <Body className="Job-name">{name}</Body>
          <Caption className="Job-next-run">
            {snoozedUntilIsoStr
              ? `snoozed 'till: ${getNextRunEstimate(snoozedUntilIsoStr)}`
              : `next in: ${getNextRunEstimate(nextRunDate as any)}`}
          </Caption>
        </div>
        {!!message && <Code block className="Job-message" children={message} />}
      </div>
      {!!actionCount && <div className="grippy" />}
      <div className="Job-actions">
        {actions.isSnoozeActionVisible ? (
          <div
            className="Job-snooze"
            onClick={(evt) => {
              onSnooze(name);
              hideActionMenu(evt);
            }}
            style={{ height: "100%", width: "100%" }}
            children={<img src={snoozeUrl} />}
          />
        ) : null}
      </div>
    </div>
  );
};
