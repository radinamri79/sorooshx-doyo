from django.test import TestCase
from apps.conversations.models import Conversation, Message
from apps.users.models import CustomUser


class TestConversation(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="chat@example.com", username="chatuser", password="testpass123"
        )

    def test_create_ai_conversation(self):
        conv = Conversation.objects.create(type="ai_chat", title="Test AI Chat")
        conv.participants.add(self.user)
        assert conv.type == "ai_chat"
        assert conv.participants.count() == 1

    def test_create_message(self):
        conv = Conversation.objects.create(type="ai_chat")
        msg = Message.objects.create(
            conversation=conv, sender=self.user, role="user", content="Hello"
        )
        assert msg.content == "Hello"
        assert msg.role == "user"
