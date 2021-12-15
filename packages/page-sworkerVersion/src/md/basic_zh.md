# **1 sWorker版本与升级说明**
本文意在说明各版本的基础信息和升级方式，来帮助大家顺利完成sWorker的版本升级。下面是一些基础的问答：

问：为什么会有新版本？
- Crust是一个不断更新与进化的网络，有些功能需要通过更新sWorker的方式进行升级

问：老版本过期后会产生什么影响？ 
- 老版本在过期之后，所有的工作量都会无效
- 无法进行升级

问：尽快升级新版本的优势？
- 尽快接入新功能，获得网络上的优势
- 及时修复BUGs，避免损失
- 部分新版本前期会暂停链上惩罚，协助大家顺利升级

问：sWorker版本迭代周期？
- 一般在半年到一年 

问：目前有哪些可用的版本？
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.0.0" target="_blank" >V1.0.0 : First Version (0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.1.0" target="_blank" >V1.1.0 : Support Metaverse (0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a)</a>
- <a href="https://github.com/crustio/crust-sworker/releases/tag/v1.1.1" target="_blank" >V1.1.1 : Protect Diskdrop (0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503)</a>

# **升级对象**

<text style="color: red">工作量上报正常的Member 节点，Isolation 节点</text>

# **推荐版本**

<text style="color: red">V1.1.1 : Protect Diskdrop (0xa61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503)</text>

# **2 升级指南 V1.0.0 -> V1.1.1**

## **2.1 升级时间**

请尽快在每个era的0%-60%之间进行升级操作，来避免本次升级带来的一个era收益损失。(注：其他时间升级有50%的概率损失一个era的算力和收益)

![update_time](../assets/update_time_zh.png)

##  **2.2 升级步骤**
### **2.2.1 确认sworker上报工作量正常**

通过sworker日志文件来确认近期工作量处于正常上报状态。如不正常，请优先修复后再进行升级操作。
通过命令查询工作量是否上报成功
<br>

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 100 sworker</div>
<br>

![workreport_status](../assets/workreport_status_zh.png)

### **2.2.2 更新IPFS镜像** 
<br>

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust tools upgrade-image ipfs</div>
<br>

### **2.2.3 重启IPFS服务**

<br>

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust reload ipfs</div>
<br>

### **2.2.4 sWorker升级**
<br>

 升级过程是一个后台进程，耗时在100s-10000s不等，<text style="color: red">**强烈建议手动执行升级命令**</text>，避免出现不必要的错误，如果升级出现异常，<text style="color: red">**切记不能reload sworker服务，以防数据丢失**</text>。 

<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade a61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503 > upgrade.log 2>&1 &</div>
<br>


## **2.3 升级状态检测**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![upgrade_status](../assets/upgrade_status_zh.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v1.1.1_zh.png)

# **3 升级指南 V1.1.0 -> V1.1.1**

##  **3.1 升级步骤**

### **3.1.1 确认sworker上报工作量正常**
通过sworker日志文件来确认近期工作量处于正常上报状态。如不正常，请优先修复后再进行升级操作。
通过命令查询工作量是否上报成功
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust logs --tail 100 sworker</div>
<br>

![workreport_status](../assets/workreport_status_zh.png)

### **3.1.2 sWorker升级**
<br>

 升级过程是一个后台进程，耗时在100s-10000s不等，<text style="color: red">**强烈建议手动执行升级命令**</text>，避免出现不必要的错误，如果升级出现异常，<text style="color: red">**切记不能reload sworker服务，以防数据丢失**</text>。 
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">nohup sudo crust tools sworker-ab-upgrade a61ea2065a26a3f9f1e45ad02d8b2965c377b85ba409f6de7185c485d36dc503 > upgrade.log 2>&1 &</div>
<br>

## **3.2 升级状态检测**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">tail 100 upgrade.log -f</div>
<br>

![upgrade_status](../assets/upgrade_status_zh.png)

<div style="background: black; font-size: 18px; font-weight:bold; color: white">sudo crust version
</div>
<br>

![sworker_version](../assets/version_v1.1.1_zh.png)

