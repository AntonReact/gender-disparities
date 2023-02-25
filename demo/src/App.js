import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import membersMock from "./mocks/members.json";
import { Table } from "./components/Table";
import { AddUser } from "./components/AddUser";
import { Statistics } from "./components/Statistics";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:8080";

function App() {
  const [members, setMembers] = useState(membersMock);
  const [statistics, setStatistics] = useState({});
  const [full, setFull] = useState(false);

  const handleDelete = (member) => {
    const newMembers = members.filter(({ id }) => id !== member.id);
    setMembers(newMembers);
  };

  const handleToggleCheckbox = () => setFull(!full);

  const handleAdd = (member) => {
    setMembers([member, ...members]);
  };

  const handleStatsClick = () => {
    axios
      .post(`${ENDPOINT}/stats?mode=${full ? "full" : "binary"}`, { members })
      .then(({ data }) => {
        setStatistics(data);
      })
      .catch((response) => {
        setStatistics([]);
        toast.error(response?.response?.data || response?.message || "Error!");
      });
  };

  const handleClear = () => {
    setMembers([]);
  }

  return (
    <div className="App">
      <AddUser key={members.length} onSubmit={handleAdd} />
      <Table members={members} onDelete={handleDelete} />
      {!!members.length && (
        <div className="clear-button">
          <button onClick={handleClear}>Delete all</button>
        </div>
      )}
      <div className="fetch-button">
        <button className="submit-button" onClick={handleStatsClick}>
          Get gender statistics
        </button>
        <input
          id="mode"
          className="checkbox"
          type="checkbox"
          onChange={handleToggleCheckbox}
        />
        <label htmlFor="mode">Show full statistics</label>
      </div>
      <Statistics data={statistics} />
      <ToastContainer />
    </div>
  );
}

export default App;
