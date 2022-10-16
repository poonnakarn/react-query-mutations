import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

/**
 * You will start with a component that fetches
 * and displays the list of labels. You also
 * have a form for adding a new label.
 *
 * Write a mutation that adds a new label to
 * the server using the POST
 * `https://ui.dev/api/courses/react-query/labels`
 * endpoint.
 *
 * The request should send a JSON body that
 * looks like `{name:string, color:string}`.
 * That request returns a JSON object with the
 * new label.
 *
 * Your mutation should immediately update the
 * cache with the new data when it returns from
 * the server. It should also invalidate the
 * labels query to fetch the freshest data.
 *
 * While the mutation is loading, disable the
 * form and change the button label to "Adding...".
 *
 * When the mutation is successful, reset the
 * form to the original values.
 */

async function fetchLabels() {
  return fetch("https://ui.dev/api/courses/react-query/labels").then((res) =>
    res.json()
  );
}

const addLabel = async ({ name, color }) => {
  const response = await fetch(
    `https://ui.dev/api/courses/react-query/labels`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ name: name, color: color })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
};

function LabelList() {
  const labelsQuery = useQuery(["labels"], fetchLabels, {
    staleTime: 5 * 1000
  });

  if (labelsQuery.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Labels</h1>

      <ul>
        {labelsQuery.data.map((label) => (
          <li key={label.id}>
            <span style={{ color: label.color }}>{label.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddLabelForm() {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("red");
  const queryClient = useQueryClient();

  const addLabelMutation = useMutation(addLabel, {
    onSuccess: (data) => {
      console.log(data);
    },
    onSettled: (data, variables) => {
      queryClient.invalidateQueries(["labels"]);
    }
  });

  return (
    <div>
      <h1>Add Label</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Perform the mutation here

          addLabelMutation.mutate({ name, color });
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="color">Color</label>
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>

        <button
          type="submit"
          disabled={addLabelMutation.isLoading ? true : false}
        >
          {addLabelMutation.isLoading ? "Adding..." : "Add Label"}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <LabelList />
      <AddLabelForm />
    </main>
  );
}
