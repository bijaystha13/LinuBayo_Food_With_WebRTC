"use client";
import React from "react";
import OrderTracking from "../../../components/Order/OrderTracking";

export default function TrackOrderPage({ params }) {
  const { orderId } = React.use(params);

  return <OrderTracking orderId={orderId} />;
}
