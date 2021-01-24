class GDemoClassMock {
  openApp(){
    return jest.fn();
  }
  write(){
    return jest.fn();
  }
  command(){
    return jest.fn();
  }
  respond(){
    return jest.fn();
  }
  end(){
    return jest.fn();
  }
}

const gDemoClassInstanceMock = new GDemoClassMock();
gDemoClassInstanceMock.openApp = jest.fn(() => gDemoClassInstanceMock);
gDemoClassInstanceMock.write = jest.fn(() => gDemoClassInstanceMock);
gDemoClassInstanceMock.command = jest.fn(() => gDemoClassInstanceMock);
gDemoClassInstanceMock.respond = jest.fn(() => gDemoClassInstanceMock);
gDemoClassInstanceMock.end = jest.fn();

export const gDemoInstanceMock = gDemoClassInstanceMock;

export const GDemoMock = jest.fn(() => {
  return gDemoInstanceMock;
});
