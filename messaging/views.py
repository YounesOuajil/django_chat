# views.py

from rest_framework.response import Response
from authentication.models import Message 
from authentication.serializers import MessageSerializer 
from rest_framework.decorators import api_view


@api_view(['GET'])
def conversation_history(request, sender_id, receiver_id):
    # Fetch conversation history from the database
    messages = Message.objects.filter(
        sender=sender_id, recipient=receiver_id
    ) | Message.objects.filter(
        sender=receiver_id, recipient=sender_id
    )

    # Serialize the messages
    serialized_messages = MessageSerializer(messages, many=True)

    return Response(serialized_messages.data)
