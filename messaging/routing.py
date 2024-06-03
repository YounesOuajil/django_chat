from django.urls import re_path,path
from . import consumers

websocket_urlpatterns = [
    
    re_path(r"^ws/chat/(?P<sender_id>\w+)/(?P<receiver_id>\w+)/$", consumers.ChatConsumer.as_asgi()),
    # re_path(r"^ws/call/(?P<sender_id>\w+)/(?P<receiver_id>\w+)/$", consumers.CallConsumer.as_asgi()),


]

