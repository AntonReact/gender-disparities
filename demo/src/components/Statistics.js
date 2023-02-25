import { memo, useEffect } from "react";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return `rgba(${r}, ${g}, ${b}, .3)`;
};

export const Statistics = memo((props) => {
  const { data } = props;
  const { total, count, majority, minority, hasGenderDisparity } =
    data || {};

  useEffect(() => {
    if (hasGenderDisparity) {
      toast.error(
        "You have gender disparity in your company. Please take measures!"
      );
    }
  });

  const labels = Object.keys(count || {});
  const countData = Object.values(count || {});

  if (!data || !Object.keys(data).length) return null;

  const backgroundColor = countData.map(getRandomColor);

  const pieData = {
    labels,
    datasets: [
      {
        label: "Members count for each gender category",
        data: countData,
        backgroundColor,
        borderColor: "white",
        borderWidth: 6,
      },
    ],
  };

  return (
    <div className="statistics">
      <Pie data={pieData} />
      <div className="content">
        {hasGenderDisparity && (
          <p className="error-message">
            <strong>Gender disparity detected!</strong>
          </p>
        )}
        {total && (
          <p>
            <strong>Total:</strong> {total}
          </p>
        )}
        {majority && (
          <p>
            <strong>Majority:</strong> {majority}
          </p>
        )}
        {minority && (
          <p>
            <strong>Minority:</strong> {minority}
          </p>
        )}
      </div>
    </div>
  );
});
