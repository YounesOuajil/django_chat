from django.urls import path
from .views import conversation_history

urlpatterns = [
    path('api/chat/<int:sender_id>/<int:receiver_id>/history/', conversation_history),
]
