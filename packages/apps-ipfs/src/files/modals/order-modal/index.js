import {useApi} from '../../../../../react-hooks/src';
import OrderModal from './OrderModal';
import OrderModalMaxwell from './OrderModalMexwell';



function orderModal (props) {
  const {systemChain} = useApi()
  if (systemChain === "Crust Maxwell") {
      return <OrderModalMaxwell {...props}/>
  }
  return  <OrderModal {...props}/>
}
export default  orderModal
