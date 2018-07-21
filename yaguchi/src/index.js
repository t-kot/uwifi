import { Connect, SimpleSigner } from 'uport-connect';

const uport = new Connect('uWifi', {
  clientId: '2owPVrs4nJSZe17fBajLa68o54JDTS6v219',
  network: 'rinkeby',
  signer: SimpleSigner('0f1252e4406922e7da2b1434195b9bae018e5164cc6e08bbf27919a67e7ece3f'),
});

window.addEventListener('load', () => {
  console.log('will request');
  uport.requestCredentials({
    requested: ['name', 'phone', 'country'],
    notifications: true,
  }).then((credentials) => {
    console.log(credentials);
    uport.attestCredentials({
      sub: credentials.address,
      claim: { test: 'yes' },
      exp: Date.now() + 5 * 60 * 1000,
    });
  });
});