"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { OrderDetail } from "@/types";
import { formatDate, formatDateTime, formatPrice, getStatusColor } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await ordersApi.get(id);
      setOrder(data);
    } catch {
      router.push("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    try {
      const updated = await ordersApi.updateStatus(order.id, newStatus);
      setOrder(updated);
    } catch {
      // silently fail
    }
  };

  if (isLoading) return <Spinner className="mt-20" />;
  if (!order) return null;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Provider</p>
            <p className="font-medium">{order.provider?.business_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium">{formatPrice(order.price)}</p>
          </div>
          {order.service && (
            <div>
              <p className="text-gray-500">Service</p>
              <p className="font-medium">
                {typeof order.service === "object" ? order.service.title : order.service}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Created</p>
            <p className="font-medium">{formatDateTime(order.created_at)}</p>
          </div>
          {order.scheduled_date && (
            <div>
              <p className="text-gray-500">Scheduled</p>
              <p className="font-medium">{formatDate(order.scheduled_date)}</p>
            </div>
          )}
        </div>

        {order.description && (
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Description</p>
            <p className="text-gray-700 mt-1">{order.description}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="flex gap-2 mt-6">
          {order.status === "pending" && (
            <>
              <Button onClick={() => handleStatusUpdate("accepted")} size="sm">
                Accept
              </Button>
              <Button onClick={() => handleStatusUpdate("rejected")} variant="danger" size="sm">
                Reject
              </Button>
            </>
          )}
          {order.status === "accepted" && (
            <Button onClick={() => handleStatusUpdate("in_progress")} size="sm">
              Start
            </Button>
          )}
          {order.status === "in_progress" && (
            <Button onClick={() => handleStatusUpdate("completed")} size="sm">
              Complete
            </Button>
          )}
          {["pending", "accepted", "in_progress"].includes(order.status) && (
            <Button onClick={() => handleStatusUpdate("cancelled")} variant="outline" size="sm">
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Status History */}
      {order.status_logs && order.status_logs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
          <div className="space-y-3">
            {order.status_logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                <div>
                  <span className="font-medium">
                    {log.from_status} → {log.to_status}
                  </span>
                  <span className="text-gray-500 ml-2">
                    by {log.changed_by_email} · {formatDateTime(log.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
