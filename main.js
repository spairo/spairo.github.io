console.log("inside");



document.addEventListener("DOMContentLoaded", function(event) {

  console.log("inside 1");

  const filters = [
    {vendorId: 32903, productId: 2603},
    {vendorId: 32902, productId: 40239}
  ];

  let button = document.getElementById('request-device');

  button.addEventListener('click', async () => {

    console.log("---inside---");
    let device;
    //let usbDeviceProperties = { name: "pad", vendorId: 32903, productId: 2603 };
    
    try {
      device = await navigator.usb.requestDevice({ filters: filters });
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });


});

async function talkToArduino() {
    console.log("talking");
    try {
      console.log("evals");

      let device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xFF3202 }] });

      console.log(device);

      await device.open(); // Begin a session.
      await device.selectConfiguration(1); // Select configuration #1 for the device.
      await device.claimInterface(2); // Request exclusive control over interface #2.
      await device.controlTransferOut({
        requestType: 'class',
        recipient: 'interface',
        request: 0x22,
        value: 0x01,
        index: 0x02
      });

      // Ready to receive data
      let result = device.transferIn(5, 64); // Waiting for 64 bytes of data from endpoint #5.
      let decoder = new TextDecoder();
      document.getElementById('target').innerHTML = 'Received: ' + decoder.decode(result.data);
    } catch (error) {
      document.getElementById('target').innerHTML = error;
    }
}
