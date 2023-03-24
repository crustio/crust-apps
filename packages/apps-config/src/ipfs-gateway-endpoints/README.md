# Existing gateway

You can view existing gateways [here](./index.ts)

# IPFS Public Gateway Endpoints

Here you can contribute your IPFS W3Auth gateway to Crust Apps, it will show like below:

![gw list](./docs/images/gw-list.png)

Among them, the green icon indicates that it is running, and the red icon indicates that the gateway has errors waiting to be fixed. A gray icon means pending review.


## Contribution Step

### 1. Run IPFS Public Gateway

1. You can refer [this doc](https://docs.ipfs.io/concepts/ipfs-gateway/#gateway-types) to learn the concept of IPFS public gateway
2. Then, you can refer [this doc](https://docs.ipfs.io/how-to/configure-node/#gateway) to config an IPFS gateway node

### 2. Run W3Auth service

Please refer [this doc](https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW#deploy) to install and config W3Auth service.

### 3. Propose a PR

Please fork this repo, and add your gateway to `index.ts` with the following format

```typescript
{
    value: 'https://crustipfs.xyz',
    text: t('Crust Network'),
    location: t('Singapore'),
    // crustAddress: cTM4JJMox7nbUqa1R6yMDwnqdEJByWDzHtdr1QczT2MqEVC33
}
```
The following is the parameter description
- 'value':    your gateway url
- 'text':     your organization name
- 'location': where is your gateway
- '// crustAddress': for receiving rewards. `Be careful not to forget the double slashes`

In the PR, you need share your **machine's user name and ip addres**, which is used for crust to check the gateway status. Please add the following pubkey into the .ssh to give access right. If you meet any problem, please ask in the telegram or discord.

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCupHsTjokVeyUOE6Ju3q4sdluCXZ5J6KfZRPzBY9jBuo5h7on/BZxPPlyGQJEBsr9pwhsZLU6zMFnIKJ3lkOeDitIQfnwFKGoekVxocy74g7psW5tXir2Sbo2B4h2dtE5HIZXoChcoKj3QkH4Zgoa0pOvVBQ4Dae84/1KPlrXZlOmXIdREYwNrx7CpKXAjf2xq7swFiuv5l42x2W5iQu/5kz0/6u2zSqKFFOcYmFjveJYJF/MYr7nnCsJCxWayVcbLu3npq19+83siimjUCdsTsnYtjivKWB7OdPRlQdhIuK45YjjWBb1PVFuseGh+6GPrTC3jGZR1P78xQ97UyUn+Ouf2serR0XEK7mEAUI4P0R/tZ1yTLp7ptlxyopDdp0XdHxX4CH6HrBGmBfeFIW/BgyG0krxWj8uZf94n41KP959IWpnXcEobJtONeH+kyF/SqU6/1lnpj1bsyM+qgOWdmF9kmW4cvxpPmSSIYz5h5VV2JZwbJLascKtRlmXx6IE= ubuntu@VM-0-3-ubuntu
```

Then, after your PR merged, you'll see your gateway on [Crust Apps](https://apps.crust.network/) with gray icon

### 4. Waiting to be reviewed

Please wait patiently for the technical team to review, after the review is passed, your Gateway will be online. Gray icons also turn green. 

Now congratulations, you have made a great contribution to the Crust

