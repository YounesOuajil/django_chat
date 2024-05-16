from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from authentication.models import Message,User  # Import the Message model
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        self.sender_channel_name = f"user_{self.sender_id}"
        self.receiver_channel_name = f"user_{self.receiver_id}"

        # Add sender to its own channel group
        await self.channel_layer.group_add(
            self.sender_channel_name,
            self.channel_name
        )

        # Add receiver to its own channel group
        await self.channel_layer.group_add(
            self.receiver_channel_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove sender from its channel group upon disconnection
        await self.channel_layer.group_discard(
            self.sender_channel_name,
            self.channel_name
        )

        # Remove receiver from its channel group upon disconnection
        await self.channel_layer.group_discard(
            self.receiver_channel_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Save the message
        await self.save_message(message)

        # Send message to both sender's and receiver's channel groups
        await self.channel_layer.group_send(
            self.sender_channel_name,
            {
                "type": "chat.message",
                "message": message,
                "sender_id": self.sender_id,
                
            }
        )

      
    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        
        
        # Send message back to sender
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            
            
        }))

    @sync_to_async
    def save_message(self, message):
        # Retrieve sender and recipient user objects
        sender = User.objects.get(id=self.sender_id)
        recipient = User.objects.get(id=self.receiver_id)

        # Create and save message to the database
        Message.objects.create(sender=sender, recipient=recipient, content=message)
