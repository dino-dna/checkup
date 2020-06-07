import { h } from "preact";
import { Job as JobInterface } from "../../interfaces";
import { Body } from "./Text";
import { Job, JobProps } from "./Job";
import "./Statuses.scss";

export type StatusesProps = {
  onSnooze: JobProps["onSnooze"];
  jobs: JobInterface[];
};
export const Statuses = ({ onSnooze, jobs }: StatusesProps) => {
  return !jobs.length ? (
    <div className="Statuses">
      <Body
        center
        children='Click "Configure" and setup a job'
        className="Statuses-empty"
      />
    </div>
  ) : (
    <ol className="Statuses">
      {jobs
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((job) => (
          <li key={job.name}>
            <Job onSnooze={onSnooze} job={job} />
          </li>
        ))}
    </ol>
  );
};
