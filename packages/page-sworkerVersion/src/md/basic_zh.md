# **版本**

**V1.0.0 : Frist Version**: 0xe6f4e6ab58d6ba4ba2f684527354156c009e4969066427ce18735422180b38f4 <br>
**V1.1.0 : Support IPFS CID V1**: 0xff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a <br>

## **1. 升级对象**
Member 节点，Isolation 节点

## **2. 升级时间**

请在每个era的0%-60%之间进行升级操作，每个era可以选择适量Member节点进行升级

![update_time](../assets/update_time_zh.png)

##  **3. 升级步骤**
### **3.1 拉取最新IPFS镜像**

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust tools upgrade-image ipfs ff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a
</div>
<br>

### **3.2 重启IPFS服务**
<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust reload ipfs</div>
<br>

### **3.3 Sworker服务AB升级**
此过程是一个持续的过程，耗时在100s-3600s不等，升级成功之前请切记不能关闭终端，升级成功之后程序自动退出.
<br>

<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust tools sworker-ab-upgrade ff2c145fd797e1aef56b47a91adf3d3294c433bb29b035b3020d04a76200da0a</div>
<br>

## **4. 升级状态检测**

<br>
<div style="background: black; font-size: 18px; font-weight:bold; color: white">ubuntu@crust:~$ sudo crust version
</div>
<br>

![sworker_version](../assets/sworker_version_zh.png)
