from django.urls import re_path,path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    
    re_path(r"^ws/chat/(?P<sender_id>\w+)/(?P<receiver_id>\w+)/$", ChatConsumer.as_asgi()),
]

