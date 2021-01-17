// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from "prop-types";
import { useEffect } from "react";
import { connect } from "redux-bundler-react";

import OrderList from "./OrderList";

const Order = ({ doFetchOrders, watchList, doAddOrder }) => {
  useEffect(() => {
    doFetchOrders();
  }, []);
  return (
    <div className={"w-100"}>
      <button
        onClick={() => {
          doAddOrder({
            fileCID: "124",
            fileSize: "123121",
            startTime: "12312",
            expireTime: "1221",
            fileStatus: 2,
            pinsCount: 1
          });
        }}
      >
        添加
      </button>

      {watchList ? <OrderList watchList={watchList} /> : <div>noone</div>}
    </div>
  );
};

export default connect("doFetchOrders", "doAddOrder", "selectWatchList", Order);
