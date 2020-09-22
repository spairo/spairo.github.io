console.log("loaded");

document.addEventListener("DOMContentLoaded", function(event) {

  console.log("inside");

  const filters = [
    {
      vendorId: 0x0424, productId: 0x2514
    }
  ];

  let button = document.getElementById('request-device');

  button.addEventListener('click', async () => {

    console.log("---async---");
    let device;
    //let usbDeviceProperties = { vendorId: 32903, productId: 2603 };
    
    try {
      device = await navigator.usb.requestDevice({ filters: filters });
      console.log(device);
  
      await device.open(); // Begin a session.
      await device.selectConfiguration(1); // Select configuration #1 for the device.
      await device.claimInterface(2);
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
      console.log('Error: ' + error.message);
      document.getElementById('target').innerHTML = error.message;
    }
  });


});
