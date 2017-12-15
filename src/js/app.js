App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load addresses
    $.getJSON('../students.json', function(data) {
      data.forEach(function(student,i,data){
        web3.eth.getBalance(student.address,function(err,balance){
          var balance = web3.fromWei(balance);
          $('#students > tbody:last-child').append('<tr> \
            <th scope="row">'+student.name+'</th> \
            <td>'+student.address+'</td>  \
            <td>'+balance+'</td> \
            <td id="'+student.address+'">...wait</td></tr> \
            ');
        });
      });
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
  // TESTRPC load:
  $.getJSON('HumanStandardToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TokenTArtifact = data;

      // ROPSTENL USING deployed contract:
      App.contracts.Token = TruffleContract(TokenTArtifact);                                // Set contract ABI
      // Set the provider for our contract
      App.contracts.Token.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.getBCTBalances();
    });


},

bindEvents: function() {

},

getBCTBalances: function() {
  $.getJSON('../students.json', function(data) {
    data.forEach(function(student,i,data){
      return App.getBCTBalance(student.address);
    });
  });
},

getBCTBalance: function(address, account) {
  App.contracts.Token.at('0x220392e76058BAd0798E16F16987093EBB0944DB').then(function(instance) {
    Tokennstance = instance;
    return Tokennstance.balanceOf.call(address);
  }).then(function(balance){
    $('#'+address).text(balance);
  }).catch(function(err) {
    console.log(err.message);
  });
},

handleAdopt: function(event) {

},


initCodeTable: function(i) {

},

addCodes: function(form) {
  var codes = [];
  var values = [];
  for (var i = 0; i < form.length-1; i+=2) {
      //console.log(form[i].value + form[i+1].value);\
      var code = form[i].value;
      var value = Number(form[i+1].value);

      if(code != '' && value != '') {
        if(isNaN(value) || !isFinite(value)) {
          alert("Value '" + form[i+1].value + "' is wrong at row " + (i/2+1) + ". Codes not sumbited");
          return;
        }
        codes.push(code);
        values.push(value);
      }
    }
    web3.eth.contract([{"constant": false,"inputs": [{"name": "hashes","type": "bytes32[]"},{"name": "amounts","type": "uint256[]"}],"name": "addCodes","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"}]).
    at('0x220392e76058BAd0798E16F16987093EBB0944DB').addCodes(codes, values, {
            gas: 300000,
            from: web3.eth.accounts[0]
        }, (err, result) => {
            if (result) {
                console.log("Tx hash: ", result);
                
            } else {
                console.log("Oopss.. Didn't work :(");
            }
        });

    alert("Submiting " +codes.length + " codes.");
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
