const columns = ["Name", "Sex", "Gender", "Pronoun"];

export const Table = (props) => {
  const { members, onDelete } = props;

  const renderColumn = (column) => <th key={column}>{column}</th>;

  const renderCell = (value = null, idx) => <td key={idx}>{value}</td>;

  const renderRow = (row) => (
    <tr key={row.id}>
      {columns.map((column, idx) => renderCell(row[column.toLowerCase()], idx))}
      <td>
        <button onClick={() => onDelete(row)}>delete</button>
      </td>
    </tr>
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map(renderColumn)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{members.map(renderRow)}</tbody>
      </table>
    </div>
  );
};
