  count = 0;
  if(count = 0){
    document.getElementById("1").style.display = "none";
  }

  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };
  
  const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
  
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
  
  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      'gateway': 'example',
      'gatewayMerchantId': 'exampleGatewayMerchantId'
    }
  };
  
  const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks
    }
  };
  
  const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
      tokenizationSpecification: tokenizationSpecification
    }
  );
  
  let paymentsClient = null;
  
  function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
          allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
  }
  
  function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
      merchantName: 'Sterkinekor'
    };
  
    paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
  
    return paymentDataRequest;
  }

  function getGooglePaymentsClient() {
    if ( paymentsClient === null ) {
      paymentsClient = new google.payments.api.PaymentsClient({
          environment: 'TEST',
        paymentDataCallbacks: {
          onPaymentAuthorized: onPaymentAuthorized
        }
      });
    }
    return paymentsClient;
  }
  var paymentSuccessMessage = "Successful Payment";
  var PaymentId = 0;
  
  function onPaymentAuthorized(paymentData) {
    return new Promise(function(resolve, reject){
      processPayment(paymentData)
        .then(function() {
          resolve({transactionState: 'SUCCESS'});
          fetch('http://localhost:56236/api/payment',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },            
            body: JSON.stringify({paymentMessage:paymentSuccessMessage, id:itemId2,cartid:cartId2})
          }).then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err))

          fetch(`http://localhost:56236/api/payment/getpaymentdetails?cartid=${cartId2}&itemid=${itemId2}`)
          .then(result => result.json())
          .then(users => {
              users.forEach(function(user){
                console.log("Payment ID : ",user.paymentId);
                PaymentId = user.paymentId;
              })
          }); 
          document.getElementById("demo").innerHTML = PaymentId;
        })
        .catch(function() {
          resolve({
            transactionState: 'ERROR',
            error: {
              intent: 'PAYMENT_AUTHORIZATION',
              message: 'Insufficient funds, try again. Next attempt should work.',
              reason: 'PAYMENT_DATA_INVALID'
            }
          });
          });
    });
  }
  
  function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
      .then(function(response) {
        if (response.result) {
          addGooglePayButton();
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }
  
  function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
    document.getElementById('container').appendChild(button);
  }
  
  var total1 = 0;
  var total2 = 0;
  var cartId1 = 0;
  var cartId2 = 0;
 fetch('http://localhost:56236/api/cart')
  .then(result => result.json())
  .then(user => {
      user.forEach(function(users){
        total1 = users.finalTotal;
        cartId1 = users.cartId;
      })
  }); 
  fetch('http://localhost:56236/api/cart')
  .then(result => result.json())
  .then(users => {
      console.log(users);
      total2 = users[users.length - 1].finalTotal;
/*       users.forEach(function(user){
        
        total2 = user.finalTotal;
        console.log(total2)
        cartId2 = user.cartId;
      }) */
  }); 
  var itemId1 = 0;
  var itemId2 = 0;
 fetch('http://localhost:56236/api/item')
  .then(result => result.json())
  .then(users => {
      users.forEach(function(user){
        itemId1 = user.id;
      })
  }); 
  fetch('http://localhost:56236/api/item')
  .then(result => result.json())
  .then(users => {
      users.forEach(function(user){
        itemId2 = user.id;
      })
  }); 


  function getGoogleTransactionInfo() {
    return {
      countryCode: 'ZA',
      currencyCode: "ZAR",
      totalPriceStatus: "FINAL",
      totalPrice: total2.toString(),
      totalPriceLabel: "Total"
    };
  }
  
  function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest);
  }
  
  let attempts = 0;

  function processPayment(paymentData) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        paymentToken = paymentData.paymentMethodData.tokenizationData.token;
              if (attempts++ % 2 == 0) {
            reject(new Error('Every other attempt fails, next one should succeed'));      
        } else {
            resolve({});      
        }
      }, 500);
    });
  }















/* const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
};

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedCardAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  }
};

const cardPaymentMethod = Object.assign(
  {},
  baseCardPaymentMethod,
  {
    tokenizationSpecification: tokenizationSpecification
  }
);

let paymentsClient = null;

function getGoogleIsReadyToPayRequest() {
  return Object.assign(
      {},
      baseRequest,
      {
        allowedPaymentMethods: [baseCardPaymentMethod]
      }
  );
}

function getGooglePaymentDataRequest() {
  const paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod]; 
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  paymentDataRequest.merchantInfo = {
    merchantName: 'Example Merchant'
  };

  paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

  return paymentDataRequest;
}

function getGooglePaymentsClient() {
  if ( paymentsClient === null ) {
    paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized
      }
    });
  }
  return paymentsClient;
}

function onPaymentAuthorized(paymentData) {
        return new Promise(function(resolve, reject){
    // handle the response
    processPayment(paymentData)
    .then(function() {
      resolve({transactionState: 'SUCCESS'});
    })
    .catch(function() {
      resolve({
        transactionState: 'ERROR',
        error: {
          intent: 'PAYMENT_AUTHORIZATION',
          message: 'Insufficient funds',
          reason: 'PAYMENT_DATA_INVALID'
        }
      });
        });
  });
}

function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
      .then(function(response) {
        if (response.result) {
          addGooglePayButton();
        }
      })
      .catch(function(err) {
        // show error in developer console for debugging
        console.error(err);
      });
}

function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button =
      paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
  document.getElementById('container').appendChild(button);
}

//   let getJSON = (url, callback) => {

//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
    
//     xhr.responseType = 'json';

//     xhr.onload = () => {

//         let status = xhr.status;

//         if (status == 200) {
//             callback(null, xhr.response);
//         } else {
//             callback(status);
//         }
//     };

//     xhr.send();
// };

// getJSON('http://localhost:50382/api/cart', (err, data) => {

//     if (err != null) {
//         console.error(err);
//     } else {

//         let text = `Date: ${data.title}`

//         console.log(text);
//     }
// });
var total = 0;
fetch('http://localhost:50382/api/cart')
.then(result => result.json())
.then(users => {
    users.forEach(function(user){
      console.log(user.title,user.quantity, user.itemCost, user.totalCost);
      total = user.totalCost;
      console.log(total);
    })
});
function getGoogleTransactionInfo() {
  return {
    countryCode: 'US',
    currencyCode: "USD",
    totalPriceStatus: "FINAL",
    totalPrice: total.toString(),
    totalPriceLabel: "Total"
  };
}

function onGooglePaymentButtonClicked() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.loadPaymentData(paymentDataRequest);
}

function processPayment(paymentData) {
        return new Promise(function(resolve, reject) {
        setTimeout(function() {
                // @todo pass payment token to your gateway to process payment
                paymentToken = paymentData.paymentMethodData.tokenizationData.token;
console.log(paymentToken);
        resolve({});
    }, 3000);
  });
} */