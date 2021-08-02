import {useApi} from "../../../../react-hooks/src";
import WatchItem from './WatchItem';
import WatchItemMaxwell from './WatchItemMaxwell';



function orderModal (props) {
  const {systemChain} = useApi()
  if (systemChain === "Crust Maxwell") {
    return <WatchItemMaxwell {...props}/>
  }
  return  <WatchItem {...props}/>
}
export default  orderModal
