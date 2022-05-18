import React from "react";
import ReactDOM from "react-dom";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";

// This example was taken directly from React Docs.
// https://reactjs.org/docs/portals.html for more info.

const appRoot = document.getElementById("app-root");
const modalRoot = document.getElementById("modal-root");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicks: 0, modalOpen: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      clicks: state.clicks + 1,
    }));
  }

  render() {
    return (
      <div>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools to observe that the button is not a child
          of the div with the onClick handler.
        </p>
        <button
          type="button"
          onClick={() =>
            this.setState((prevState) => ({
              ...prevState,
              modalOpen: !prevState.modalOpen,
            }))
          }
        >
          Click to open modal
        </button>
        {!this.state.modalOpen ? null : (
          <Modal>
            <Child>
              <button onClick={this.handleClick}>Click</button>
            </Child>
          </Modal>
        )}
      </div>
    );
  }
}

function Child({ children, ...props }) {
  return (
    <div className="modal" {...props}>
      {children}
    </div>
  );
}

export default {
  title: "Example/ReactPortalWithInteraction",
  component: Parent,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Parent>;

const Template: ComponentStory<typeof Parent> = (args) => <Parent {...args} />;

export const BeforeInteraction = Template.bind({});

export const AfterInteraction = Template.bind({});

// // More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
AfterInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loginButton = await canvas.getByRole("button", {
    name: /Click to open modal/i,
  });
  await userEvent.click(loginButton);
};
