# Develop

## .bash_profile

```
export RINKEBY_MNEMONIC='teacher school ...';
export INFURA_ACCESS_TOKEN='aaaa';
```

## Local

Recommend to use Ganache.app

```
$ truffle compile; truffle migrate --reset;
$ truffle console

> var uWifiCore; UWifiCore.deployed().then(c => uWifiCore = c);
> var bl = c => console.log(c.toNumber());
> uWifiCore.buyTicket.sendTransaction({ value: web3.toWei(0.01, 'ether') });
> uWifiCore.lastBuyer.call();
> uWifiCore.getRemainingTimeForUser(....);
> uWifiCore.remainingTime.call().then(bl);
> uWifiCore.clearMyTicket.sendTransaction();
```

## Deploy

```
$ truffle compile; truffle migrate --reset network rinkeby
```


# Ideas not implemented

- Create security or governance token. It is to change contract core logic (eg: payment token), and receives dividend from service.
- Distribute fee to wifi providers. It is difficult but Bitcoin Mining pool and Storj are helpful.
- Add bandwidth to ticket's metadata.
- Reject access-point who provides poor network quality by user voting.
- Related to below, access-point registry.

[challenge]
- User from poor countries or living in disaster area (this is verified by some authority on uPort) can use this service at a low price. (governance token may be helpful)
