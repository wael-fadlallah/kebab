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

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(element)
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = fiber.props[name]));

  return dom;
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    don: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  /**
   * Add the dom node to the fiber
   */
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  /**
   * Loop through the children and create a new fiber for each of them and assign them to the current fiber
   */
  const elements = fiber.props.children;
  let prevSibling = null;
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }

  /**
   * Return the next unit of work
   * First check the child if any, then check for a sibling or parent sibling(uncle) while navigating the tree backwards
   */
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
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
