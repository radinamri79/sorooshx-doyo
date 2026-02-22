from django.test import TestCase
from apps.orders.models import Order


class TestOrderTransitions(TestCase):
    def test_valid_transitions_from_pending(self):
        order = Order(status="pending")
        assert order.can_transition_to("accepted") is True
        assert order.can_transition_to("rejected") is True
        assert order.can_transition_to("cancelled") is True
        assert order.can_transition_to("completed") is False

    def test_valid_transitions_from_accepted(self):
        order = Order(status="accepted")
        assert order.can_transition_to("in_progress") is True
        assert order.can_transition_to("cancelled") is True
        assert order.can_transition_to("pending") is False

    def test_completed_no_transitions(self):
        order = Order(status="completed")
        assert order.can_transition_to("pending") is False
        assert order.can_transition_to("cancelled") is False
