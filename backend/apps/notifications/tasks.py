from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task
def send_notification_task(user_id, notification_type, title, message, data=None):
    from .models import Notification
    from apps.users.models import CustomUser

    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return

    notification = Notification.objects.create(
        recipient=user,
        type=notification_type,
        title=title,
        message=message,
        data=data or {},
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user_id}",
        {
            "type": "send_notification",
            "data": {
                "id": str(notification.id),
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "data": notification.data,
                "created_at": notification.created_at.isoformat(),
            },
        },
    )
