const expect = require("expect");
const {generateMessage} = require("./message");

describe("#generateMessage", ()=>{
  it("should generate the correct message object", ()=>{
    const message = generateMessage('Alexandra', 'Hello World');
    expect(message.from).toBe('Alexandra');
    expect(message.text).toBe('Hello World');
    expect(message.createdAt).toBeA('number')
  });
});