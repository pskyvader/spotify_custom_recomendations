// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("@devexpress/dx-react-chart-material-ui", () => ({
  Chart: () => null,
  ArgumentAxis: () => null,
  ValueAxis: () => null,
  LineSeries: () => null,
  Toolbar: () => null,
  ZoomAndPan: () => null,
}));

jest.mock("@devexpress/dx-react-chart", () => ({
  ArgumentAxis: () => null,
  ValueAxis: () => null,
  LineSeries: () => null, 
  ZoomAndPan: () => null,
  Animation: () => null,
  EventTracker: () => null,
  HoverState: () => null,
  SelectionState: () => null,
}));
