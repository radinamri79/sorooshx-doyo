from django.contrib import admin
from .models import Conversation, Message, MessageAttachment


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ["sender", "role", "content", "created_at"]


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_display = ["id", "type", "title", "is_active", "created_at"]
    list_filter = ["type", "is_active"]
    search_fields = ["title"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["id", "conversation", "sender", "role", "created_at"]
    list_filter = ["role"]


@admin.register(MessageAttachment)
class MessageAttachmentAdmin(admin.ModelAdmin):
    list_display = ["file_name", "file_type", "file_size", "created_at"]
