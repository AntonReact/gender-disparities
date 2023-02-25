import { useId, useReducer, useState } from "react";

const sex = ["male", "female", "other"];

const pronouns = [
  "she",
  "her",
  "hers",
  "herself",
  "he",
  "him",
  "his",
  "himself",
  "they",
  "them",
  "their",
  "theirs",
  "themself",
  "ze",
  "zee",
  "zir",
  "zere",
  "hir",
  "here",
  "zirs",
  "hirs",
  "zirself",
  "hirself",
];

const genderIdentity = [
  "agender",
  "androgyne",
  "androgynous",
  "bigender",
  "cis",
  "cis female",
  "cis male",
  "cis man",
  "cis woman",
  "cisgender",
  "cisgender female",
  "cisgender male",
  "cisgender man",
  "cisgender woman",
  "female to male",
  "ftm",
  "gender fluid",
  "gender nonconforming",
  "gender questioning",
  "gender variant",
  "genderqueer",
  "intersex",
  "male to female",
  "mtf",
  "neither",
  "neutrois",
  "non-binary",
  "other",
  "pangender",
  "trans",
  "trans female",
  "trans male",
  "trans man",
  "trans person",
  "trans woman",
  "trans*",
  "trans* female",
  "trans* male",
  "trans* man",
  "trans* person",
  "trans* woman",
  "transfeminine",
  "transgender",
  "transgender female",
  "transgender male",
  "transgender man",
  "transgender person",
  "transgender woman",
  "transmasculine",
  "transsexual",
  "transsexual female",
  "transsexual male",
  "transsexual man",
  "transsexual person",
  "transsexual woman",
  "two-spirit",
];

const renderOption = (value) => (
  <option key={value} value={value.toLowerCase()}>
    {value}
  </option>
);

const reducer = (state, action) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "sex":
      return { ...state, sex: action.payload };
    case "pronoun":
      return { ...state, pronoun: action.payload };
    case "gender":
      return { ...state, gender: action.payload };
    case "clear":
      return {};
    default:
      return state;
  }
};

export const AddUser = (props) => {
  const { onSubmit } = props;
  const id = useId();
  const [state, dispatch] = useReducer(reducer, { id });
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.name) {
      setError(true);
      return;
    }
    onSubmit(state);
    dispatch({ type: "clear" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={state.name || ""}
        style={{ borderColor: error ? 'red' : 'gainsboro' }}
        type="text"
        onChange={(ev) => {
          setError(false);
          dispatch({ type: "name", payload: ev.target.value });
        }}
      />
      <select
        value={state.sex || ""}
        className={state.sex ? "" : "no-value"}
        onChange={(ev) => dispatch({ type: "sex", payload: ev.target.value })}
      >
        <option default disabled value="">sex</option>
        {sex.map(renderOption)}
      </select>
      <select
        value={state.pronoun || ""}
        className={state.pronoun ? "" : "no-value"}
        onChange={(ev) =>
          dispatch({ type: "pronoun", payload: ev.target.value })
        }
      >
        <option default disabled value="">pronoun</option>
        {pronouns.map(renderOption)}
      </select>
      <select
        value={state.gender || ""}
        className={state.gender ? "" : "no-value"}
        onChange={(ev) =>
          dispatch({ type: "gender", payload: ev.target.value })
        }
      >
        <option default disabled value="">gender</option>
        {genderIdentity.map(renderOption)}
      </select>
      <button className="submit-button" type="submit">submit</button>
    </form>
  );
};
