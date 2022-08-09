/** @jsx Kebab.createElement */

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(value) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: value,
      children: [],
    },
  };
}

function render(element, container) {
  const node =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => (node[name] = element.props[name]));

  if (element.props.children.length > 0) {
    element.props.children.map((child) => render(child, node));
  }

  container.appendChild(node);
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}

const Kebab = {
  createElement,
  render,
};

const element = (
  <div id="Test">
    <p new={true}>Test</p>
  </div>
);

const container = document.getElementById("root");
Kebab.render(element, container);
