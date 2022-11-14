/** @jsx Kebab.createElement */
import Kebab from "./library/Kebab.js";

const element = (
  <div id="Test">
    <p style={'color: "red"'}>Test</p>
    <p>Test</p>
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
  </div>
);

const App = () => {
  return <h2>Hello functional component</h2>;
};

// const Counter = () => {
//   const [state, setState] = Kebab.useState(1);
//   return (
//     <button
//       onClick={() => {
//         console.log("clicked");
//         // setState((c) => c + 1);
//       }}
//     >
//       Count:
//     </button>
//   );
// };

const component = <App />;
const container = document.getElementById("root");
Kebab.render(component, container);
