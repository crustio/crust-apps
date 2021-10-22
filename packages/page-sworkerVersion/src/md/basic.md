# **Versions**

**Version A**: 0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4 <br>
**Version B**: 0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a <br>

## **1. Upgrade Target**
Member node and Isolation node

## **2. Upgrade Time**

Please upgrade between 0%-60% of each era, and choose an appropriate number of Member nodes to upgrade in each era

![update_time](../assets/update_time.png)

##  **3. Upgrade Steps**
### **3.1 Pull the latest IPFS image**

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust tools upgrade-image ipfs ff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a
</div>
<br>

### **3.2 Reload IPFS server**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust reload ipfs</div>
<br>

### **3.3 Sworker server AB upgrade**
This process is a continuous process, which takes time ranging from 100s to 3600s. Please remember not to close the terminal before the upgrade is successful. The program will exit automatically after the upgrade is successful.
<br>

<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust tools sworker-ab-upgrade ff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a</div>
<br>

## **4. Upgrade Status Detection**

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust version
</div>
<br>

![sworker_version](../assets/sworker_version.png)
