# **1 Instructions**
This article is intended to explain the basic information and upgrade methods of each version to help you successfully complete the version upgrade of sWorker. Here are some basic questions and answers:

Q: Why is there a new version?
- Crust is a constantly updating and evolving network, some functions need to be deploied by updating sWorker

Q: What impact will the old version have when it expires?
- After the old version expires, all workloads will be invalid
- Unable to upgrade to new version

Q: What are the advantages of upgrading to the new version as soon as possible?
- Access new functions as soon as possible to gain advantages on the network
- Fix BUGs in time to avoid error
- Some new versions will suspend on-chain punishment in the early stage to help everyone upgrade smoothly

Q: What is the iteration cycle of sWorker version?
- Generally from six months to one year

Q: What versions are currently available?
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.0.0" target="_blank" >V1.0.0 : First Version (0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.1.0" target="_blank" >V1.1.0 : Support Metaverse (0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.1.1" target="_blank" >V1.1.1 : Protect Diskdrop (0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.1.2" target="_blank" >V1.1.2 : Fix Bugs (0x72041ba321cb982168beab2b3994f8b0b83a54e6dafaa95b444a3c273b490fb1)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v2.0.0" target="_blank" >V2.0.0 : Support ECDSA DCAP Attestation (0x69f72f97fc90b6686e53b64cd0b5325c8c8c8d7eed4ecdaa3827b4ff791694c0)</a>


# **Nodes**

<text style="color: red">Member and Isolation with normal workload reporting</text>

# **Recommended version**

<text style="color: red">V1.1.2 : Fix Bugs (0x72041ba321cb982168beab2b3994f8b0b83a54e6dafaa95b444a3c273b490fb1)</text>

# **Upgrade Guides**
- [V1.0.0->V1.1.1](#v100tov111)
- [V1.1.0->V1.1.1](#v110tov111)
- [V1.1.0/V1.1.1->V1.1.2](#v111tov112)
- [V1.x.x->V2.0.0](#v1xxtov200)

# **2 Upgrade guide V1.0.0 -> V1.1.1** <a id="v100tov111"></a>
## **2.1 Time**

Please perform the upgrade operation as soon as possible in the time between 0%-60% of each era to avoid the loss of an era's revenue caused by this upgrade. (Note: Upgrading at other times has a 50% probability of losing one era's computing power and income)

![update_time](../assets/update_time.png)

##  **2.2 Steps**

### **2.2.1 Check sworker sending work report successfully**
Make sure that the sworker sent the work report successfully in the past hours. If not, please fix the error first before doing the upgrade steps.

Use the following command to check whether the workload is reported successfully

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 10 sworker
</div>
<br>

![workreport_status](../assets/workreport_status.png)

### **2.2.2 Upgrade IPFS image**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust tools upgrade-image ipfs</div>
<br>

### **2.2.3 Restart IPFS service**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust reload ipfs</div>
<br>

### **2.2.4 sWorker Upgrade**
The upgrade process is a background process, which takes time ranging from 1000s to 10000s. <text style="color: red">**It is strongly recommended to execute the upgrade command manually**</text> to avoid unnecessary errors. If the upgrade is abnormal, <text style="color: red">**do not restart the sworker service, which will cause data loss**</text>. 

<text style="color: red">**CAUTION:**</text>
<br>
<text style="color: red">**DO NOT run 'crust reload sworker' command during upgrade, which may cause data loss and then require to re-srd the whole disk.**</text>

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade a61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503 > upgrade.log 2>&1 &</div>
<br>


## **2.3 Upgrade status detection**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![sworker_version](../assets/upgrade_status.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v1.1.1_en.png)

# **3 Upgrade guide V1.1.0 -> V1.1.1** <a id="v110tov111"></a>

##  **3.1 Steps**

### **3.1.1 Check sworker sending work report successfully**
Make sure that the sworker sent the work report successfully in the past hours. If not, please fix the error first before doing the upgrade steps.

Use the following command to check whether the workload is reported successfully

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 10 sworker
</div>
<br>

![workreport_status](../assets/workreport_status.png)

### **3.1.2 sWorker Upgrade**
The upgrade process is a background process, which takes time ranging from 1000s to 10000s. <text style="color: red">**It is strongly recommended to execute the upgrade command manually**</text> to avoid unnecessary errors. If the upgrade is abnormal, <text style="color: red">**do not restart the sworker service, which will cause data loss**</text>. 

<text style="color: red">**CAUTION:**</text>
<br>
<text style="color: red">**DO NOT run 'crust reload sworker' command during upgrade, which may cause data loss and then require to re-srd the whole disk.**</text>

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade a61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503 > upgrade.log 2>&1 &</div>
<br>

## **3.2 Upgrade status detection**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![sworker_version](../assets/upgrade_status.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v1.1.1_en.png)

# **4 Upgrade guide V1.1.0/V1.1.1 -> V1.1.2** <a id="v111tov112"></a>

##  **4.1 Steps**

### **4.1.1 Check sworker sending work report successfully**
Make sure that the sworker sent the work report successfully in the past hours. If not, please fix the error first before doing the upgrade steps.

Use the following command to check whether the workload is reported successfully

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 10 sworker
</div>
<br>

![workreport_status](../assets/workreport_status.png)

### **4.1.2 sWorker Upgrade**
The upgrade process is a background process, which takes time ranging from 1000s to 10000s. <text style="color: red">**It is strongly recommended to execute the upgrade command manually**</text> to avoid unnecessary errors. If the upgrade is abnormal, <text style="color: red">**do not restart the sworker service, which will cause data loss**</text>. 

<text style="color: red">**CAUTION:**</text>
<br>
<text style="color: red">**DO NOT run 'crust reload sworker' command during upgrade, which may cause data loss and then require to re-srd the whole disk.**</text>

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade 72041ba321cb982168beab2b3994f8b0b83a54e6dafaa95b444a3c273b490fb1 > upgrade.log 2>&1 &</div>
<br>

## **4.2 Upgrade status detection**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![sworker_version](../assets/upgrade_status.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v1.1.2_en.png)

# **5 Upgrade guide V1.x.x -> V2.0.0** <a id="v1xxtov200"></a>

##  **5.1 Steps**

## Note: 

sworker v2.0.0 supports ECDSA-based DCAP attestation, but also compatible with EPID IAS attestation, so you can upgrade from old v1.x to v2.0.0 directly with the following instructions which won't trigger re-entrynetwork.

But if you want to use the ECDSA-based DCAP attestation for your new servers or re-entrynetwork for current servers, please refer to [Crust Wiki: EPID & ECDSA](https://wiki.crust.network/docs/en/Q&AForEPID-ECDSA) for more information. 

### **5.1.1 Check sworker sending work report successfully**
Make sure that the sworker sent the work report successfully in the past hours. If not, please fix the error first before doing the upgrade steps.

Use the following command to check whether the workload is reported successfully

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 10 sworker
</div>
<br>

![workreport_status](../assets/workreport_status.png)

### **5.1.2 sWorker Upgrade**
The upgrade process is a background process, which takes time ranging from 1000s to 10000s. <text style="color: red">**It is strongly recommended to execute the upgrade command manually**</text> to avoid unnecessary errors. If the upgrade is abnormal, <text style="color: red">**do not restart the sworker service, which will cause data loss**</text>. 

<text style="color: red">**CAUTION:**</text>
<br>
<text style="color: red">**DO NOT run 'crust reload sworker' command during upgrade, which may cause data loss and then require to re-srd the whole disk.**</text>

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade 69f72f97fc90b6686e53b64cd0b5325c8c8c8d7eed4ecdaa3827b4ff791694c0 > upgrade.log 2>&1 &</div>
<br>

## **5.2 Upgrade status detection**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![sworker_version](../assets/upgrade_status.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v2.0.0_en.png)