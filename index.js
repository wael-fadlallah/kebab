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

const container = document.getElementById("root");
Kebab.render(element, container);
