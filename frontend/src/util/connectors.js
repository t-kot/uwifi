import { Connect, SimpleSigner } from 'uport-connect'

export let uport = new Connect('uWifi', {
  clientId: '2owPVrs4nJSZe17fBajLa68o54JDTS6v219',
  network: 'rinkeby',
  signer: SimpleSigner('0f1252e4406922e7da2b1434195b9bae018e5164cc6e08bbf27919a67e7ece3f'),
})
export const web3 = uport.getWeb3()
