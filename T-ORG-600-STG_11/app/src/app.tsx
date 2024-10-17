import "./app.css";

import React from "preact/compat";
import { useState } from "preact/hooks";

import { withSubordinates } from "./services";
import { getCharts } from "./mocks";

import { Chart } from "./components/Chart";
import { Label } from "./components/Label";

export function App() {
  const [currentChart, setCurrentChart] = useState(0);

  const charts = getCharts();

  if (!charts) {
    return <div class={"loading"}>Loading...</div>;
  }

  return (
    <>
      <Indicator
        current={currentChart}
        setCurrentChart={setCurrentChart}
        count={charts.length}
      />
      <Label label={charts[currentChart].label} />
      <Chart chart={withSubordinates(charts[currentChart])} />
    </>
  );
}

interface IndicatorProps {
  current: number;
  setCurrentChart: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}

const Indicator = (props: IndicatorProps) => {
  const { current, setCurrentChart, count } = props;

  return (
    <div class="indicator-container">
      {Array.from({ length: count }, (_, i) => (
        <div
          class={`indicator-circle ${current === i ? "active" : ""}`}
          onClick={() => setCurrentChart(i)}
        ></div>
      ))}
    </div>
  );
};
