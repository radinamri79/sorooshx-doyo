"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.list();
      setOrders(data.results);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Spinner className="mt-20" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You don&apos;t have any orders yet.</p>
          <Link
            href="/providers"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Providers
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  {order.service_title || order.provider_name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{order.provider_name}</span>
                <span>{formatPrice(order.price)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{formatDate(order.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
