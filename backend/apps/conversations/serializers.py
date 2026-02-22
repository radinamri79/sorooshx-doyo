from rest_framework import serializers
from apps.users.serializers import UserSerializer
from .models import Conversation, Message, MessageAttachment


class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageAttachment
        fields = ["id", "file", "file_name", "file_type", "file_size", "created_at"]
        read_only_fields = ["id", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    attachments = MessageAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "role", "content", "metadata", "attachments", "created_at"]
        read_only_fields = ["id", "sender", "role", "created_at"]


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["content"]


class ConversationListSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "type", "title", "participants", "last_message", "is_active", "created_at", "updated_at"]

    def get_last_message(self, obj):
        msg = obj.messages.order_by("-created_at").first()
        if msg:
            return MessageSerializer(msg).data
        return None


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "type", "title", "participants", "order", "messages", "is_active", "created_at", "updated_at"]
