/**
 * Email Stub Module
 *
 * This stub is used during static page generation to avoid
 * bundling react-email components which conflict with Next.js.
 * The actual react-email components are loaded dynamically at runtime.
 */

// Stub components that do nothing
const StubComponent = () => null;

module.exports = {
  Html: StubComponent,
  Head: StubComponent,
  Preview: StubComponent,
  Body: StubComponent,
  Container: StubComponent,
  Section: StubComponent,
  Text: StubComponent,
  Img: StubComponent,
  Hr: StubComponent,
  Link: StubComponent,
  Button: StubComponent,
  render: () => Promise.resolve(''),
};
